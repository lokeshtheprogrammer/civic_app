from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from jose import JWTError, jwt
import cloudinary
import cloudinary.uploader

from . import crud, models, schemas, security, config
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_officer(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "officer":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.post("/users/me/device-token", response_model=schemas.User)
def update_device_token(
    token_data: schemas.DeviceToken,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.update_user_device_token(db, user=current_user, token=token_data.device_token)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Civic Issue Tracker API"}

@app.get("/issues/", response_model=List[schemas.Issue])
def read_issues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    issues = crud.get_issues(db, skip=skip, limit=limit)
    return issues

@app.get("/issues/{issue_id}", response_model=schemas.Issue)
def read_issue(issue_id: str, db: Session = Depends(get_db)):
    db_issue = crud.get_issue(db, issue_id=issue_id)
    if db_issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return db_issue

@app.post("/issues/", response_model=schemas.Issue)
def create_issue(issue: schemas.IssueCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.create_issue(db=db, issue=issue, user_id=current_user.id)

@app.patch("/issues/{issue_id}/assign", response_model=schemas.Issue)
def assign_issue_to_self(
    issue_id: str,
    db: Session = Depends(get_db),
    current_officer: models.User = Depends(get_current_active_officer),
):
    issue = crud.get_issue(db, issue_id=issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    if issue.assignee_id:
        raise HTTPException(status_code=400, detail="Issue already assigned")
    return crud.assign_issue_to_user(db=db, issue=issue, user_id=current_officer.id)

@app.patch("/issues/{issue_id}/status", response_model=schemas.Issue)
def update_issue_status(
    issue_id: str,
    status_update: schemas.IssueUpdate,
    db: Session = Depends(get_db),
    current_officer: models.User = Depends(get_current_active_officer),
):
    issue = crud.get_issue(db, issue_id=issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    # A more robust implementation would check for valid status transitions
    return crud.update_issue_status(db=db, issue=issue, status=status_update.status)

@app.get("/issues/me/", response_model=List[schemas.Issue])
def read_my_issues(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    return crud.get_issues_by_reporter(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/issues/unassigned/", response_model=List[schemas.Issue])
def read_unassigned_issues(
    db: Session = Depends(get_db),
    current_officer: models.User = Depends(get_current_active_officer),
    skip: int = 0,
    limit: int = 100,
):
    return crud.get_unassigned_issues(db, skip=skip, limit=limit)

@app.get("/issues/assigned/", response_model=List[schemas.Issue])
def read_assigned_issues(
    db: Session = Depends(get_db),
    current_officer: models.User = Depends(get_current_active_officer),
    skip: int = 0,
    limit: int = 100,
):
    return crud.get_issues_by_assignee(db, user_id=current_officer.id, skip=skip, limit=limit)


@app.post("/issues/upload-image/")
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    try:
        # Upload image to Cloudinary
        result = cloudinary.uploader.upload(file.file)
        return {"url": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {e}")

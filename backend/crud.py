from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash
import uuid

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        id=str(uuid.uuid4()),
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        department_id=user.department_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_issues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).offset(skip).limit(limit).all()

def get_issue(db: Session, issue_id: str):
    return db.query(models.Issue).filter(models.Issue.id == issue_id).first()

def create_issue(db: Session, issue: schemas.IssueCreate, user_id: str):
    db_issue = models.Issue(
        id=str(uuid.uuid4()),
        title=issue.title,
        description=issue.description,
        category=issue.category,
        priority=issue.priority,
        latitude=issue.location.lat,
        longitude=issue.location.lng,
        address=issue.location.address,
        reporter_id=user_id
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

def assign_issue_to_user(db: Session, issue: models.Issue, user_id: str):
    issue.assignee_id = user_id
    db.commit()
    db.refresh(issue)
    return issue

def update_issue_status(db: Session, issue: models.Issue, status: str):
    issue.status = status
    db.commit()
    db.refresh(issue)
    return issue

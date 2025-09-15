from sqlalchemy.orm import Session
from sqlalchemy import func
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
    create_log_entry(db, user_id=db_user.id, action="user_created", details={"user_id": db_user.id, "email": db_user.email})
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
        reporter_id=user_id,
        imageUrl=issue.imageUrl
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    create_log_entry(db, user_id=user_id, action="issue_created", details={"issue_id": db_issue.id, "title": db_issue.title})
    return db_issue

def assign_issue_to_user(db: Session, issue: models.Issue, user_id: str):
    issue.assignee_id = user_id
    db.commit()
    db.refresh(issue)
    create_log_entry(db, user_id=user_id, action="issue_assigned", details={"issue_id": issue.id, "assignee_id": user_id})
    return issue

def get_issues_by_reporter(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).filter(models.Issue.reporter_id == user_id).offset(skip).limit(limit).all()

def get_issues_by_assignee(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).filter(models.Issue.assignee_id == user_id).offset(skip).limit(limit).all()

def get_unassigned_issues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).filter(models.Issue.assignee_id == None).offset(skip).limit(limit).all()

def update_user_device_token(db: Session, user: models.User, token: str):
    user.device_token = token
    db.commit()
    db.refresh(user)
    return user

from firebase_admin import messaging

def update_issue_status(db: Session, issue: models.Issue, status: str):
    old_status = issue.status
    issue.status = status
    db.commit()
    db.refresh(issue)

    # Send notification to the reporter
    if issue.reporter and issue.reporter.device_token:
        message = messaging.Message(
            notification=messaging.Notification(
                title="Issue Status Updated",
                body=f"The status of your issue '{issue.title}' has been updated to: {issue.status}",
            ),
            token=issue.reporter.device_token,
        )
        try:
            response = messaging.send(message)
            print("Successfully sent message:", response)
        except Exception as e:
            print(f"Error sending FCM message: {e}")

    create_log_entry(db, user_id=issue.assignee_id, action="status_updated", details={"issue_id": issue.id, "old_status": old_status, "new_status": status})
    return issue

# Analytics Functions
def get_issue_count_by_status(db: Session):
    return db.query(models.Issue.status, func.count(models.Issue.id)).group_by(models.Issue.status).all()

def get_issue_count_by_category(db: Session):
    return db.query(models.Issue.category, func.count(models.Issue.id)).group_by(models.Issue.category).all()

# Log Functions
def get_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Log).order_by(models.Log.timestamp.desc()).offset(skip).limit(limit).all()

def create_log_entry(db: Session, user_id: str, action: str, details: dict = None):
    log_entry = models.Log(
        user_id=user_id,
        action=action,
        details=details
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry

# Vote Functions
def add_vote(db: Session, issue: models.Issue, user: models.User):
    issue.voted_by_users.append(user)
    db.commit()
    db.refresh(issue)
    create_log_entry(db, user_id=user.id, action="vote_added", details={"issue_id": issue.id})
    return issue

def remove_vote(db: Session, issue: models.Issue, user: models.User):
    issue.voted_by_users.remove(user)
    db.commit()
    db.refresh(issue)
    create_log_entry(db, user_id=user.id, action="vote_removed", details={"issue_id": issue.id})
    return issue

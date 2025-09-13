from sqlalchemy.orm import Session
from . import models, schemas
import uuid

def get_issues(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Issue).offset(skip).limit(limit).all()

def create_issue(db: Session, issue: schemas.IssueCreate):
    db_issue = models.Issue(
        id=str(uuid.uuid4()),
        title=issue.title,
        description=issue.description,
        category=issue.category,
        priority=issue.priority,
        latitude=issue.location.lat,
        longitude=issue.location.lng,
        address=issue.location.address,
        reportedBy="Citizen X" # Placeholder
    )
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

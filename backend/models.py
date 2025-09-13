from sqlalchemy import Column, String, Float, DateTime
from .database import Base
import uuid
from datetime import datetime

class Issue(Base):
    __tablename__ = "issues"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    status = Column(String, default="Submitted")
    priority = Column(String, default="Medium")
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String, nullable=True)
    reportedBy = Column(String)
    reportedAt = Column(DateTime, default=datetime.utcnow)
    imageUrl = Column(String, nullable=True)

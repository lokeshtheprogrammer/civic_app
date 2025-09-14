from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True)

    officers = relationship("User", back_populates="department")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, index=True) # "citizen", "officer", "admin"
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)

    department = relationship("Department", back_populates="officers")
    issues_reported = relationship("Issue", back_populates="reporter")

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
    reportedAt = Column(DateTime, default=datetime.utcnow)
    imageUrl = Column(String, nullable=True)

    reporter_id = Column(String, ForeignKey("users.id"))
    reporter = relationship("User", back_populates="issues_reported")

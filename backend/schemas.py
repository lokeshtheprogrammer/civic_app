from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class IssueBase(BaseModel):
    title: str
    description: str
    category: str
    location: Location
    priority: str

class IssueCreate(IssueBase):
    pass

class Issue(IssueBase):
    id: str
    status: str
    reportedBy: str
    reportedAt: datetime
    imageUrl: Optional[str] = None

    class Config:
        orm_mode = True

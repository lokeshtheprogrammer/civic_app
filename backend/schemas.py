from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Department Schemas
class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: str

    class Config:
        orm_mode = True

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str
    department_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str

    class Config:
        orm_mode = True

# Issue Schemas
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
    imageUrl: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class Issue(IssueBase):
    id: str
    status: str
    reporter_id: str
    reportedAt: datetime
    imageUrl: Optional[str] = None
    reporter: User
    assignee_id: Optional[str] = None
    assignee: Optional[User] = None

    class Config:
        orm_mode = True

class IssueUpdate(BaseModel):
    status: Optional[str] = None

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

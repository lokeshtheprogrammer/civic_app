from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# CORS Middleware
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Default Vite dev server port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = None

class Issue(BaseModel):
    id: str
    title: str
    description: str
    category: str
    status: str
    priority: str
    location: Location
    reportedBy: str
    reportedAt: datetime
    imageUrl: Optional[str] = None

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    location: Location
    priority: str

# In-memory database
db_issues: List[Issue] = [
    Issue(
        id=str(uuid.uuid4()),
        title='Large Pothole on Main Street',
        description='A large pothole has developed near the intersection of Main Street and Oak Avenue, causing traffic hazards.',
        category='Roads',
        status='Submitted',
        priority='High',
        location=Location(lat=12.9716, lng=77.5946, address='Main St, Bengaluru'),
        reportedBy='Citizen A',
        reportedAt=datetime.now(),
        imageUrl='https://placehold.co/400x250/F87171/FFFFFF?text=Pothole',
    ),
    Issue(
        id=str(uuid.uuid4()),
        title='Streetlight out on Park Avenue',
        description='The streetlight outside 123 Park Avenue has been out for three nights.',
        category='Electricity',
        status='Assigned',
        priority='Medium',
        location=Location(lat=13.0827, lng=80.2707, address='Park Ave, Chennai'),
        reportedBy='Citizen B',
        reportedAt=datetime.now(),
        imageUrl='https://placehold.co/400x250/60A5FA/FFFFFF?text=Streetlight',
    )
]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Civic Issue Tracker API"}

@app.get("/issues", response_model=List[Issue])
def get_issues():
    return db_issues

@app.post("/issues", response_model=Issue, status_code=201)
def create_issue(issue: IssueCreate):
    new_issue = Issue(
        id=str(uuid.uuid4()),
        title=issue.title,
        description=issue.description,
        category=issue.category,
        status='Submitted',
        priority=issue.priority,
        location=issue.location,
        reportedBy='Citizen X', # Placeholder
        reportedAt=datetime.now(),
        imageUrl=f"https://placehold.co/400x250/cccccc/FFFFFF?text={issue.category.replace(' ', '+')}"
    )
    db_issues.insert(0, new_issue)
    return new_issue

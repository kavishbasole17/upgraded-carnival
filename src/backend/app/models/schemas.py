from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class Priority(str, Enum):
    EXTREME = "EXTREME"
    STRONG = "STRONG"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class Status(str, Enum):
    OPEN = "Open"

class Location(BaseModel):
    district: str
    village: str
    lat: float
    lng: float

class TicketInput(BaseModel):
    raised_by: str
    phone_no: str
    location: Location
    description: str
    created_at: datetime

class TicketResponse(BaseModel):
    ticket_id: str
    priority: str
    priority_score: int
    category: str
    status: str
    rule_score: int
    llm_score: int
    llm_reason: str
    org_id: Optional[str] = None


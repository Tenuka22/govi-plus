from ninja import Schema
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import EmailStr


class FarmerCreateSchema(Schema):
    name: str
    email: EmailStr
    phone: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    experience_level: int
    farming_methods: List[str] = []
    communication_channels: List[str] = []
    crop_preferences: List[str] = []
    is_active: bool


class FarmerSelectSchema(Schema):
    id: UUID
    name: str
    email: EmailStr
    phone: str
    address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    experience_level: int
    farming_methods: List[str] = []
    communication_channels: List[str] = []
    crop_preferences: List[str] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime

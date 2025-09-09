from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from uuid import UUID
from .schema import FarmerSelectSchema
from .models import FarmerEntry
from django.http import HttpRequest

router = Router()


@router.get("", response=List[FarmerSelectSchema])
def get_farmer__entries(request: HttpRequest):
    farmers = FarmerEntry.objects.all()
    return farmers


@router.get("{farmer_id}", response=FarmerSelectSchema)
def get_farmer_entry(request: HttpRequest, farmer_id: UUID):
    farmer = get_object_or_404(FarmerEntry, id=farmer_id)
    return farmer

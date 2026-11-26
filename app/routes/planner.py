import asyncio
import time
from fastapi import APIRouter, HTTPException
from .model import TravelRequestModel
from services.weather import fetch_weather
from services.places import fetch_places
from services.currency import fetch_currency_rates
from services.cache import _cache, clear_cache

router = APIRouter(
    prefix="/plan",
    tags=["Travel Plan"],
)

@router.post("/")
async def create_travel_plan(
    travel_request: TravelRequestModel
):
    """Aggregate Weather, Currency and Places data into a single travel plan."""

    if travel_request.start_date > travel_request.end_date:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date",
        )
    trip_days = (travel_request.end_date - travel_request.start_date).days + 1

    if trip_days < 1:
        raise HTTPException(
            status_code=400,
            detail="Trip duration must be at least 1 day",
        )

    if trip_days > 14:
        raise HTTPException(
            status_code=400,
            detail="Trip duration cannot be longer than 14 days",
        )

    # weather_data , currency_data, places_data would be fetched here using the respective services

    weather_data, places_data, currency_rates = await asyncio.gather(
        fetch_weather(
            destination=travel_request.destination,
            start_date=travel_request.start_date,
            end_date=travel_request.end_date,
        ),
        fetch_places(travel_request.destination),
        fetch_currency_rates(travel_request.base_currency),
    )
 
    return{
        "message": "Travel plan created successfully",
        "weather_data": weather_data,
        "places_data": places_data,
        "currency_rates": currency_rates,
    }


@router.get("/cache-stats")
async def get_cache_stats():
    """View cache statistics."""
    now = time.time()
    entries = []
    for key, entry in _cache.items():
        age = now - entry["timestamp"]
        remaining = max(0, entry["ttl"] - age)
        entries.append({
            "key": key,
            "ttl": entry["ttl"],
            "age_seconds": round(age, 1),
            "remaining_seconds": round(remaining, 1),
            "expired": remaining <= 0,
        })
    return {
        "total_entries": len(entries),
        "entries": entries,
    }


@router.delete("/cache")
async def delete_cache():
    """Clear all cached data."""
    clear_cache()
    return {"message": "Cache cleared successfully"}



@router.get("/cache-stats")
async def get_cache_stats():
    """View cache statistics."""
    now = time.time()
    entries = []
    for key, entry in _cache.items():
        age = now - entry["timestamp"]
        remaining = max(0, entry["ttl"] - age)
        entries.append({
            "key": key,
            "ttl": entry["ttl"],
            "age_seconds": round(age, 1),
            "remaining_seconds": round(remaining, 1),
            "expired": remaining <= 0,
        })
    return {
        "total_entries": len(entries),
        "entries": entries,
    }


@router.delete("/cache")
async def delete_cache():
    """Clear all cached data."""
    clear_cache()
    return {"message": "Cache cleared successfully"}
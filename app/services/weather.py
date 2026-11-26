import httpx
from datetime import date
from routes.model import WeatherResponseModel
from services.cache import get_cache, set_cache, clear_cache

async def fetch_weather(
        destination: str, 
        start_date: date, 
        end_date: date
)->list[WeatherResponseModel]:

    cache_key = f"weather_{destination}_{start_date}_{end_date}"
    cached_data = get_cache(cache_key)
    if cached_data:
        return cached_data

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.weatherapi.com/v1/forecast.json",
            params={
                "key": "a44ba919a1fa4ae9bab185235262411",
                "q": destination,
                "dt": start_date,
                "end_dt": end_date,
            }
        )
        response.raise_for_status()
        data = response.json()

        forcasts =[]
        for forecast in data["forecast"]["forecastday"]:
            forcasts.append(
                WeatherResponseModel(
                    date=forecast["date"],
                    condition=forecast["day"]["condition"]["text"],
                    temperature_high=forecast["day"]["maxtemp_c"],
                    temperature_low=forecast["day"]["mintemp_c"],
                    humidity=forecast["day"]["avghumidity"],
                    rain_chance=forecast["day"]["daily_chance_of_rain"],
                )
            ) 
        set_cache(cache_key, forcasts, ttl=3600)  # Cache for 1 hour
        return forcasts


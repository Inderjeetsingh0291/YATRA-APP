from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.planner import router as planner_router
from routes.stream import router as stream_router

app = FastAPI(
    title="Yatra Planner API",
    description="Aggregate travel data from multiple sources to provide single plan with SSE support",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "app":"Yatra Planner API",
        "version":"1.0.0",
        "endpoint":{
            "POST /plan": "Create a travel plan (Aggregated)",
            "POST /stream/plan": "Stream travel plan (SSE)",
            "GET /plan/cache-stats": "View cache statistics for travel plans",
            "DELETE /plan/cache": "Clear cache for travel plans",
        }
    }

app.include_router(planner_router)
app.include_router(stream_router)

import uvicorn
import logging
import config
from fastapi import FastAPI
from pydantic import BaseModel
from logging.config import dictConfig
from fastapi.middleware.cors import CORSMiddleware
import schema as schema

dictConfig(config.LOGGING)
log = logging.getLogger("uvicorn")

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

@app.on_event("startup")
async def on_startup():
    schema.create_tables()

@app.on_event("shutdown")
async def on_shutdown():
    schema.close_connection()

@app.post("/signup")
def signin_user(user: User):
    print(user)
    return { "status_code": 200, "message": f"User created successfully" }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=5000)
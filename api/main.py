import uvicorn
import logging
import config
from fastapi import FastAPI
from pydantic import BaseModel
from logging.config import dictConfig
from fastapi.middleware.cors import CORSMiddleware
import schema as schema
from sqlmodel import Session, select
from fastapi.responses import JSONResponse
import secrets
import hashlib

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


@app.post("/signup", response_model=User)
def signin_user(user: User):
    with Session(schema.engine) as session:
        db_user = session.exec(
            select(schema.User)
            .where(schema.User.email == user.email)
        ).first()

        if db_user:
            return JSONResponse(status_code=400, content={"message": "User with this email already exists!"})
        
        new_user = schema.User(
            firstName=user.firstName, 
            lastName=user.lastName, 
            email=user.email, 
            password=user.password,
            salt=secrets.token_hex(16)
        )
        print(new_user)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return JSONResponse(status_code=200, content={"message": "User created successfully!"})
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=5000)
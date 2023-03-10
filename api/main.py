import uvicorn
import logging
import config
import secrets
import bcrypt
import datetime
import schema as schema
from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Session, select
from logging.config import dictConfig
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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


class UserLogin(BaseModel):
    email: str
    password: str


class UserInfo(BaseModel):
    firstName: str
    lastName: str
    email: str


@app.on_event("startup")
async def on_startup():
    schema.create_tables()


@app.get("/token/{session_token}", status_code=200)
def get_user(session_token: str):
    with Session(schema.engine) as session:
        user = session.exec(
            select(schema.User).where(schema.User.session == session_token)
        ).first()   

        return JSONResponse(
            status_code=200,
            content={"firstName": user.firstName, "lastName": user.lastName, "email": user.email},
        )


# create user login endpoint
@app.post("/signin", response_model=UserLogin, status_code=200)
def signin_user(user: UserLogin):
    with Session(schema.engine) as session:
        existing_user = session.exec(
            select(schema.User).where(schema.User.email == user.email)
        ).first()

        if not existing_user:
            return JSONResponse(
                status_code=404,
                content={"status_code": 404, "message": "User not found!"},
            )

        if (
            bcrypt.checkpw(
                user.password.encode(), existing_user.hashed_password.encode()
            )
            is False
        ):
            return JSONResponse(
                status_code=401,
                content={"status_code": 401, "message": "Incorrect password!"},
            )

        expires = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
            days=1
        )
        session_token = secrets.token_hex(16)

        existing_user.session = session_token
        session.commit()
        session.refresh(existing_user)

        response = JSONResponse(
            status_code=200,
            content={
                "status_code": 200, 
                "message": "User logged in successfully!",
                "session_token": session_token,
            },
        )
        response.set_cookie(
            key="session_token",
            value=existing_user.session,
            expires=expires,
        )
        return response


@app.post("/signup", response_model=User, status_code=201)
def signup_user(user: User):
    with Session(schema.engine) as session:
        db_user = session.exec(
            select(schema.User).where(schema.User.email == user.email)
        ).first()

        if db_user:
            return JSONResponse(
                status_code=400,
                content={
                    "status_code": 400,
                    "message": "User with this email already exists!",
                },
            )

        new_user = schema.User(
            first_name=user.firstName,
            last_name=user.lastName,
            email=user.email,
            hashed_password=bcrypt.hashpw(user.password.encode(), schema.salt)
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        response = JSONResponse(
            status_code=201,
            content={"status_code": 201, "message": "User created successfully!"},
        )
        return response


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=5000)

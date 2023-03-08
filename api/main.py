import uvicorn
import logging
import config
import hashlib
import secrets
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


@app.on_event("startup")
async def on_startup():
    schema.create_tables()


@app.post("/signup", response_model=User, status_code=201)
def signin_user(user: User):
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

        expires = datetime.datetime.now() + datetime.timedelta(days=1)
        session_token = secrets.token_hex(16)

        new_user = schema.User(
            first_name=user.firstName,
            last_name=user.lastName,
            email=user.email,
            hashed_password=hashlib.sha256(
                f"{user.password}{schema.salt}".encode()
            ).hexdigest(),
            session=session_token,
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        response = JSONResponse(
            status_code=201,
            content={"status_code": 201, "message": "User created successfully!"},
        )
        response.set_cookie(
            key="session_token",
            value=new_user.session,
            expires=expires,
        )
        return response


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=5000)

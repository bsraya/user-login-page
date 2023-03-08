from sqlmodel import Field, SQLModel, create_engine
from typing import Optional
import secrets

engine = create_engine("sqlite:///database.db", echo=True)
salt = secrets.token_hex(16)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: str
    hashed_password: str
    session: str


def create_tables():
    SQLModel.metadata.create_all(engine)

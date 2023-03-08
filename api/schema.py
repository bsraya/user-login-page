from sqlmodel import Field, SQLModel, create_engine

engine = create_engine("sqlite:///database.db", echo=True)

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    firstName: str
    lastName: str
    email: str
    password: str
    salt: str

def create_tables():
    SQLModel.metadata.create_all(engine)

def close_connection():
    engine.dispose()
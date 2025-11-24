from pydantic import BaseModel, EmailStr, Field

class UserSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "abdulazeez@x.com",
                "password": "weakpassword"
            }
        }

class ItemCreate(BaseModel):
    title: str
    description: str
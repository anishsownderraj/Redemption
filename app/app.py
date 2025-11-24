from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware            
from app.schemas import ItemCreate, UserSchema
from app.db import Item, User, create_db_and_tables, get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import select
import uuid
from app.auth import sign_jwt
from app.auth_bearer import JWTBearer


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User routes
# Sign Up
@app.post("/user/signup", tags=['user'])
async def user_signup(
    user: UserSchema,
    session: AsyncSession = Depends(get_async_session)
):
    registered_user = await session.execute(select(User).filter(User.email==user.email))
    found_user = registered_user.scalars().first()
    if found_user:
        raise HTTPException(status_code=404, detail="User already registered")
    new_user = User(
        email=user.email,
        password=user.password
    )
    session.add(new_user)
    await session.commit()
    return sign_jwt(user.email)

# Login
@app.post("/user/login", tags=['user'])
async def user_login(
    user: UserSchema,
    session: AsyncSession = Depends(get_async_session)
):
    registered_user = await session.execute(select(User).filter(User.email==user.email))
    found_user = registered_user.scalars().first()
    if not (found_user and found_user.email == user.email and found_user.password == user.password):
        return {
            "error": "Wrong login details"
        }
    else:
        return sign_jwt(user.email)

# CRUD Routes
# Create, Read, Update, Delete
# Create
@app.post("/to-do-item", dependencies=[Depends(JWTBearer())], tags=['crud'])
async def create_item(
    item: ItemCreate,
    session: AsyncSession = Depends(get_async_session)
):
    item = Item(
        title=item.title,
        description=item.description,
        finished=0,
    )
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return {"Success": "Item Created"}

# Read
@app.get("/all-items", tags=['crud'])
async def get_all_items(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Item).order_by(Item.created_at.desc()))
    items =  [row[0] for row in result.all()]
    
    items_data = []
    for item in items:
        items_data.append(
            {
                "id": str(item.id),
                "title": item.title,
                "description": item.description,
                "finished": item.finished
            }
        )
    return {"items": items_data}

# Delete
@app.delete("/items/{item_id}", dependencies=[Depends(JWTBearer())], tags=['crud'])
async def delete_item(item_id: str, session: AsyncSession = Depends(get_async_session)):
    try:
        item_uuid = uuid.UUID(item_id)
        result = await session.execute(select(Item).where(Item.id==item_uuid))
        item = result.scalars().first()

        if not item:
            raise HTTPException(status_code=404, detail='Item not found')
    
        await session.delete(item)
        await session.commit()

        return {"success": True, "message": 'Item deleted successfully'}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update
@app.put("/items/update/{item_id}", tags=['crud'])
async def update_item(item_id: str, finished: int = Query(...), session: AsyncSession = Depends(get_async_session)):
    try:
        item_uuid = uuid.UUID(item_id)
        result = await session.execute(select(Item).where(Item.id==item_uuid))
        item = result.scalars().first()

        if not item:
            raise HTTPException(status_code=404, detail='Item not found')
    
        item.finished = not finished
        await session.commit()

        return {"success": True, "message": 'Item finished updated'}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/posts",
    tags=["posts"]
)

# A simple hardcoded secret for local dev security
SECRET_AUTH_TOKEN = "vader"

@router.get("/", response_model=List[schemas.Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = db.query(models.Post).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@router.get("/{slug}", response_model=schemas.Post)
def read_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.slug == slug).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=schemas.Post)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db),
    x_auth_token: str = Header(None, alias="X-Auth-Token")
):
    # Verify the secret token
    if x_auth_token != SECRET_AUTH_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid Jedi Authorization Code")

    db_post = models.Post(
        title=post.title,
        content=post.content,
        slug=post.slug
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

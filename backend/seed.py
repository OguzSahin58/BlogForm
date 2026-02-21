from database import SessionLocal, engine
import models

def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.Post).count() == 0:
        print("Database initialized (empty).")
    else:
        print("Database already contains posts.")
    
    db.close()

if __name__ == "__main__":
    seed_data()

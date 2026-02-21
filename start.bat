@echo off
echo  Starting Backend API...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
python seed.py
start /B uvicorn main:app --reload --port 8000
echo  Backend running at http://localhost:8000
cd ..
echo  Starting Frontend...
cd frontend
start /B python -m http.server 3000
echo  Frontend running at http://localhost:3000
echo  Servers are running in the background. Close this window or use Task Manager to stop them.
pause

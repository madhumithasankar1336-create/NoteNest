# NoteNest – Smart Notes Manager
React (Vite) + Flask + SQLite. A WebGL fluid GlowCursor renders as the live background.

## Setup
### 1. Backend (Python 3.9+)
    cd backend
    python -m venv venv
    # Windows: venv\Scripts\activate    macOS/Linux: source venv/bin/activate
    pip install -r requirements.txt
    python app.py            # http://127.0.0.1:5000  (creates notes.db automatically)

### 2. Frontend (Node 18+) – in a second terminal
    cd frontend
    npm install
    npm run dev              # http://localhost:5173  (proxies /api to Flask)

## Test in the browser
Create a note -> refresh the page (still there) -> Edit -> Pin -> Archive -> Delete (confirm).
Stop and restart `python app.py`; notes remain because they live in `backend/notes.db`.

## Test the API
    curl -X POST http://127.0.0.1:5000/api/notes -H "Content-Type: application/json" -d '{"title":"Hello","content":"First note","category":"Work","tags":["demo"],"color":"#e9e3ff"}'
    curl http://127.0.0.1:5000/api/notes
    curl http://127.0.0.1:5000/api/notes/1
    curl -X PUT http://127.0.0.1:5000/api/notes/1 -H "Content-Type: application/json" -d '{"title":"Hello v2"}'
    curl -X PATCH http://127.0.0.1:5000/api/notes/1/pin
    curl -X PATCH http://127.0.0.1:5000/api/notes/1/archive
    curl -X DELETE http://127.0.0.1:5000/api/notes/1
    curl -X POST http://127.0.0.1:5000/api/notes -H "Content-Type: application/json" -d '{"title":"","content":""}'   # 400 validation error

Only the light/dark preference is kept in localStorage; all notes are stored in SQLite.

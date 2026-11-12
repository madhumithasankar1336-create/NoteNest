import json
import re

from flask import Flask, jsonify, request
from flask_cors import CORS

from database import get_db, init_db, now, row_to_note

app = Flask(__name__)
CORS(app)
init_db()

CATEGORIES = {"General", "Work", "Personal", "Ideas", "Study", "Health"}
COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


def error(message, status=400):
    return jsonify({"error": message}), status


def validate(data, partial=False):
    """Return (clean_dict, error_message)."""
    if not isinstance(data, dict):
        return None, "Request body must be a JSON object."
    clean = {}
    if not partial or "title" in data:
        title = str(data.get("title", "")).strip()
        if not title:
            return None, "Title is required."
        if len(title) > 120:
            return None, "Title must be 120 characters or fewer."
        clean["title"] = title
    if not partial or "content" in data:
        content = str(data.get("content", "")).strip()
        if not content:
            return None, "Content is required."
        if len(content) > 2000:
            return None, "Content must be 2000 characters or fewer."
        clean["content"] = content
    if "category" in data or not partial:
        category = str(data.get("category", "General")).strip() or "General"
        if category not in CATEGORIES:
            return None, "Category must be one of: " + ", ".join(sorted(CATEGORIES)) + "."
        clean["category"] = category
    if "tags" in data or not partial:
        tags = data.get("tags", [])
        if isinstance(tags, str):
            tags = tags.split(",")
        if not isinstance(tags, list):
            return None, "Tags must be a list."
        cleaned, seen = [], set()
        for tag in tags:
            tag = str(tag).strip().lstrip("#")[:24]
            if tag and tag.lower() not in seen:
                seen.add(tag.lower())
                cleaned.append(tag)
        if len(cleaned) > 8:
            return None, "Use at most 8 tags."
        clean["tags"] = json.dumps(cleaned)
    if "color" in data or not partial:
        color = str(data.get("color", "#ffffff"))
        if not COLOR_RE.match(color):
            return None, "Color must be a hex value like #ffffff."
        clean["color"] = color
    return clean, None


def fetch(note_id):
    with get_db() as conn:
        return conn.execute("SELECT * FROM notes WHERE id = ?", (note_id,)).fetchone()


@app.get("/api/notes")
def list_notes():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM notes ORDER BY is_pinned DESC, updated_at DESC").fetchall()
    return jsonify([row_to_note(r) for r in rows])


@app.post("/api/notes")
def create_note():
    clean, err = validate(request.get_json(silent=True))
    if err:
        return error(err)
    stamp = now()
    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO notes (title, content, category, tags, color, created_at, updated_at) VALUES (?,?,?,?,?,?,?)",
            (clean["title"], clean["content"], clean["category"], clean["tags"], clean["color"], stamp, stamp),
        )
        note_id = cur.lastrowid
    return jsonify(row_to_note(fetch(note_id))), 201


@app.get("/api/notes/<int:note_id>")
def get_note(note_id):
    row = fetch(note_id)
    return jsonify(row_to_note(row)) if row else error("Note not found.", 404)


@app.put("/api/notes/<int:note_id>")
def update_note(note_id):
    if not fetch(note_id):
        return error("Note not found.", 404)
    clean, err = validate(request.get_json(silent=True), partial=True)
    if err:
        return error(err)
    if not clean:
        return error("Nothing to update.")
    clean["updated_at"] = now()
    cols = ", ".join(f"{k} = ?" for k in clean)
    with get_db() as conn:
        conn.execute(f"UPDATE notes SET {cols} WHERE id = ?", (*clean.values(), note_id))
    return jsonify(row_to_note(fetch(note_id)))


@app.delete("/api/notes/<int:note_id>")
def delete_note(note_id):
    if not fetch(note_id):
        return error("Note not found.", 404)
    with get_db() as conn:
        conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    return jsonify({"message": "Note deleted.", "id": note_id})


def toggle(note_id, column):
    if not fetch(note_id):
        return error("Note not found.", 404)
    with get_db() as conn:
        conn.execute(f"UPDATE notes SET {column} = 1 - {column}, updated_at = ? WHERE id = ?", (now(), note_id))
    return jsonify(row_to_note(fetch(note_id)))


@app.patch("/api/notes/<int:note_id>/pin")
def pin_note(note_id):
    return toggle(note_id, "is_pinned")


@app.patch("/api/notes/<int:note_id>/archive")
def archive_note(note_id):
    return toggle(note_id, "is_archived")


@app.errorhandler(404)
def not_found(_):
    return error("Route not found.", 404)


@app.errorhandler(405)
def bad_method(_):
    return error("Method not allowed.", 405)


@app.errorhandler(500)
def server_error(_):
    return error("Internal server error.", 500)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

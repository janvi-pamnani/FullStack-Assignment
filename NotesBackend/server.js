const express = require("express");
const app = express();

app.use(express.json());

let notes = [];
function generateId() {
    return notes.length + 1;
}

app.post("/notes", (req, res) => {
    const { title, content } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Title cannot be empty"
        });
    }

    const newNote = {
        id: generateId(),
        title,
        content: content || "",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    notes.push(newNote);

    res.status(201).json({
        message: "Note created successfully",
        note: newNote
    });
});

app.get("/notes", (req, res) => {
    const sortedNotes = notes.sort(
        (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    );
    res.json(sortedNotes);
});

app.get("/notes/search", (req, res) => {
    const q = req.query.q;
    if (!q) {
        return res.status(400).json({
            message: "Search query missing"
        });
    }
    const result = notes.filter(note =>
        note.title
            .toLowerCase()
            .includes(q.toLowerCase())

        ||

        note.content
            .toLowerCase()
            .includes(q.toLowerCase())
    );
    res.json(result);
});


app.get("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(
        n => n.id === id
    );
    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }
    res.json(note);
});

app.put("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(
        n => n.id === id
    );
    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const { title, content } = req.body;
    if (title !== undefined) {
        note.title = title;
    }
    if (content !== undefined) {
        note.content = content;
    }
    note.updatedAt = new Date();
    res.json({
        message: "Note updated successfully",
        note
    });
});

app.delete("/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const noteIndex = notes.findIndex(
        n => n.id === id
    );
    if (noteIndex === -1) {
        return res.status(404).json({
            message: "Note not found"
        });
    }
    notes.splice(noteIndex, 1);
    res.json({
        message: "Note deleted successfully"
    });
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});
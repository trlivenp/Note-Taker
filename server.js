const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = generateUniqueId();
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    notes.push(newNote);
    fs.writeFileSync('db.json', JSON.stringify(notes));
    console.log('Note saved:', newNote); 
    res.json(newNote);
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});

// Helper function to generate a unique ID
function generateUniqueId() {
    return Date.now().toString();
}

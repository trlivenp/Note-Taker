document.addEventListener("DOMContentLoaded", function () {
    const existingNotesList = document.getElementById('existingNotes');
    const noteForm = document.getElementById('noteForm');
    const saveNoteBtn = document.getElementById('saveNote');
    const clearFormBtn = document.getElementById('clearForm');

    // Fetch existing notes when the page loads
    fetch('/api/notes')
        .then(response => response.json())
        .then(notes => {
            displayNotes(notes);
        })
        .catch(error => console.error('Error fetching notes:', error));

    // Event listener for saving a new note
    saveNoteBtn.addEventListener('click', function () {
        const noteTitleInput = document.getElementById('noteTitle');
        const noteTextInput = document.getElementById('noteText');

        const newNote = {
            title: noteTitleInput.value,
            text: noteTextInput.value,
        };

        // POST the new note to the server
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
        })
            .then(response => response.json())
            .then(savedNote => {
                // Update the UI with the new note
                appendNoteToList(savedNote);
                // Clear the form
                noteTitleInput.value = '';
                noteTextInput.value = '';
            })
            .catch(error => console.error('Error saving note:', error));
    });

    // Event listener for clearing the form
    clearFormBtn.addEventListener('click', function () {
        const noteTitleInput = document.getElementById('noteTitle');
        const noteTextInput = document.getElementById('noteText');

        // Clear the form fields
        noteTitleInput.value = '';
        noteTextInput.value = '';
    });

    // Function to display existing notes in the left-hand column
    function displayNotes(notes) {
        existingNotesList.innerHTML = '';
        notes.forEach(note => {
            appendNoteToList(note);
        });
    }

    // Function to append a single note to the list
    function appendNoteToList(note) {
        const listItem = document.createElement('li');
        listItem.textContent = note.title;

        listItem.addEventListener('click', function () {
            // Fetch and display the selected note
            fetch(`/api/notes/${note.id}`)
                .then(response => response.json())
                .then(selectedNote => {
                    // Display the selected note in the right-hand column
                    displaySelectedNote(selectedNote);
                })
                .catch(error => console.error('Error fetching selected note:', error));
        });

        existingNotesList.appendChild(listItem);
    }

    // Function to display a selected note in the right-hand column
    function displaySelectedNote(note) {
        const noteTitleInput = document.getElementById('noteTitle');
        const noteTextInput = document.getElementById('noteText');

        // Update the form fields with the selected note
        noteTitleInput.value = note.title;
        noteTextInput.value = note.text;
    }
});


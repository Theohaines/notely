const notepad = document.getElementById('notepad');
const newNoteCreator = document.getElementById("newNoteCreator");

let noteLoaded = false;
let loadedNoteName = "";

function newNote(){
    notepad.style.display = "none";
    newNoteCreator.style.display = "flex";
}

function createNewNote(){
    var noteName = document.getElementById("noteNameInput").value;

    if (!validateNoteName(noteName)){
        alert("E001: Note name too long / short");
        return;
    }

    fetch('/createnote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteName: noteName})
    })
    .then(response => response.json())
    .then(data => {
        if(data.message = "I001: Note created!"){
            notepad.style.display = "flex";
            newNoteCreator.style.display = "none";

            notepad.value = "";
            notepad.disabled = false;
            noteLoaded = true;
            loadedNoteName = noteName;
            alert(data.message);
        } else {
            alert(data.message);
            return;
        }
    })
    .catch(error => console.error(error));
}

function validateNoteName(name){
    if (name.length > 60){
        return false;
    } else if (name.length < 3) {
        return false;
    } else {
        return true;
    }
}

function saveNote(){
    if (!noteLoaded){
        alert("W001: No note is loaded");
    }

    fetch('/savenote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteName: loadedNoteName, "noteText": notepad.value})
    })
    .then(response => response.json())
    .then(data => {
        if(data.message = "I002: Note saved!"){
            alert(data.message);
        } else {
            alert(data.message);
            return;
        }
    })
    .catch(error => console.error(error));
}


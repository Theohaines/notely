const notepad = document.getElementById('notepad');
const newNoteCreator = document.getElementById("newNoteCreator");
const loadNoteMenu = document.getElementById("loadNoteMenu");
const noteView = document.getElementById("noteView");
const noteViewContainer = document.getElementById("noteViewContainer");

let noteLoaded = false;
let loadedNoteName = "";

function newNote(){
    notepad.style.display = "none";
    loadNoteMenu.style.display = "none";
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
        return;
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

function listNotes(){
    fetch('/listnotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => loadNotesGUI(data))
    .catch(error => console.error(error));
}

function loadNotesGUI(notes){
    notepad.style.display = "none";
    newNoteCreator.style.display = "none";
    loadNoteMenu.style.display = "flex";

    loadNoteMenu.innerHTML = "";

    var headerText = document.createElement("h3");
    headerText.textContent = "load note";
    loadNoteMenu.appendChild(headerText);

    for (var note of notes){
        var noteButton = document.createElement("button");
        noteButton.textContent = note;
        noteButton.className = "menu-button";
        noteButton.setAttribute("onclick", "loadNote('"+note+"')");
        loadNoteMenu.appendChild(noteButton);
    }
}

function loadNote(noteName){
    fetch('/loadnote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteName: noteName})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.message == "E004: No note exists."){
            alert(data.message);
        } else {
            noteLoaded = true;
            loadedNoteName = noteName.replace(".txt", "");
            loadDataIntoNotepad(data);
        }
    })
    .catch(error => console.error(error));
}

function loadDataIntoNotepad(noteContents){
    notepad.value = noteContents.noteContents;

    notepad.disabled = false;

    notepad.style.display = "flex";
    newNoteCreator.style.display = "none";
    loadNoteMenu.style.display = "none";
    toggleNoteView();   
}

function toggleNoteView(){
    if (noteView.style.display == "none"){
        noteView.style.display = "flex";
        notepad.style.display = "none";
    } else {
        noteView.style.display = "none";
        notepad.style.display = "flex";
        return;
    }

    loadNoteView();
}

function loadNoteView(){
    var searchByNameInput = document.getElementById("searchByNameInput");
    var searchByTagInput = document.getElementById("searchByTagInput");

    fetch('/loadnoteview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : searchByNameInput.value ,"tag" : searchByTagInput.value })
    })
    .then(response => response.json())
    .then(data => {
        loadNoteViewGUI(data);
    })
    .catch(error => console.error(error));
}

function loadNoteViewGUI(notes){

    noteViewContainer.innerHTML = "";

    for (var note of notes){
        var noteViewNote = document.createElement("div");
        noteViewNote.className = "note-view-note";
        noteViewNote.setAttribute("onclick", "loadNote('"+note[0]+"')");
        noteViewContainer.appendChild(noteViewNote)

        var noteViewNoteName = document.createElement("h3");
        noteViewNoteName.textContent = note[0];
        noteViewNote.appendChild(noteViewNoteName);

        var noteViewNoteSnippet = document.createElement("p");
        noteViewNoteSnippet.textContent = note[1];
        noteViewNote.appendChild(noteViewNoteSnippet);
    }
}

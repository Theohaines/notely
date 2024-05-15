const notepad = document.getElementById('notepad');
const welcomeSplash = document.getElementById('welcomeSplash');
const createNoteMenu = document.getElementById('createNoteMenu');
const noteOnlyToolbar = document.getElementById('noteOnlyToolbar');
const noteView = document.getElementById('noteView');

var currentlyLoadedNote = "";

function resetScreen(){
    notepad.value = "";

    notepad.style.display = "none";
    welcomeSplash.style.display = "none";
    createNoteMenu.style.display = "none";
    noteOnlyToolbar.style.display = "none";
    noteView.style.display = "none";
}

function start(){
    resetScreen();
    welcomeSplash.style.display = "flex";
}

function createNewNoteGUI(){
    resetScreen();
    createNoteMenu.style.display = "flex";
}

function createNewNote(){
    var newNoteNameInput = document.getElementById('newNoteNameInput');

    fetch('/createnote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNoteNameInput.value})
    })
    .then(response => response.json())
    .then(data => {
        if (data.message == "ok"){
            resetScreen();
            notepad.style.display = "flex";
            noteOnlyToolbar.style.display = "flex";
            currentlyLoadedNote = newNoteNameInput.value;
            newNoteNameInput.value = "";
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error(error));
}

function saveNote(){
    if (!currentlyLoadedNote){
        alert("No note loaded.");
        return;
    }

    fetch('/savenote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : currentlyLoadedNote, "body" : notepad.value })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error(error));
}

function enableNoteView(){
    var searchByNameInput = document.getElementById('searchByNameInput');
    var searchByTagInput = document.getElementById('searchByTagInput');

    fetch('/listnotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : searchByNameInput.value, "tag" : searchByTagInput.value })
    })
    .then(response => response.json())
    .then(data => {
        populateNoteView(data)
    })
    .catch(error => console.error(error));

    resetScreen();
    noteView.style.display = "flex";
}

function populateNoteView(data){
    var noteViewContainer = document.getElementById("noteViewContainer")
    
    noteViewContainer.innerHTML = "";

    for (var note of data.notes){
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

function loadNote(name){
    fetch('/loadnote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : name})
    })
    .then(response => response.json())
    .then(data => {
        if (data.note == "no note with the specified name exists." || data.note == "note could not be loaded."){
            alert(data.note);
        } else {
            resetScreen();

            data = JSON.parse(data)

            notepad.value = data.body;
            notepad.style.display = "flex";
            noteOnlyToolbar.style.display = "flex";

            currentlyLoadedNote = name;
        }
    })
    .catch(error => console.error(error));
}

start();
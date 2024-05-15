const notepad = document.getElementById('notepad');
const welcomeSplash = document.getElementById('welcomeSplash');
const createNoteMenu = document.getElementById('createNoteMenu');

var currentlyLoadedNote = "";

function resetScreen(){
    notepad.style.display = "none";
    welcomeSplash.style.display = "none";
    createNoteMenu.style.display = "none";
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

start();
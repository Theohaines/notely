const notepad = document.getElementById('notepad');
const newNoteCreator = document.getElementById("newNoteCreator");

function newNote(){
    notepad.style.display = "none";
    newNoteCreator.style.display = "flex";
}

function createNewNote(){
    var noteName = document.getElementById("noteNameInput").value;
    var errorOutput = document.getElementById("newNoteCreatorErrorOutput");

    if (!validateNoteName(noteName)){
        errorOutput.textContent = "Note name too long / short";
        return;
    } else {
        errorOutput.textContent = "";
    }

    fetch('/createnote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteName: noteName})
    })
    .then(response => response.json())
    .then(data => {
        if(data.message = "note created"){
            notepad.style.display = "flex";
            newNoteCreator.style.display = "none";

            notepad.value = "";
            notepad.disabled = false;
        } else {
            errorOutput.textContent = data.message;
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


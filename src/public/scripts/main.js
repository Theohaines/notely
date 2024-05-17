const notepad = document.getElementById('notepad');

var currentlyLoadedNote = "";

function resetScreen(){

}

function start(){
    resetScreen();
    loadNotes();
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

function loadNotes(){
    var notesSidebarSearch = document.getElementById('notesSidebarSearch');

    fetch('/listnotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : notesSidebarSearch.value })
    })
    .then(response => response.json())
    .then(data => {
        populateNotesSidebar(data)
    })
    .catch(error => console.error(error));
}

function populateNotesSidebar(data){
    var notesSidebarContainer = document.getElementById("notesSidebarContainer")
    
    notesSidebarContainer.innerHTML = "";

    for (var note of data.notes){
        var noteViewNote = document.createElement("div");
        noteViewNote.className = "sidebar-note";
        noteViewNote.setAttribute("onclick", "loadNote('"+note[0]+"')");
        notesSidebarContainer.appendChild(noteViewNote)

        var noteViewNoteName = document.createElement("h3");
        noteViewNoteName.textContent = note[0];
        noteViewNote.appendChild(noteViewNoteName);
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
            notepad.value = "";

            data = JSON.parse(data)

            notepad.value = data.body;
            notepad.style.display = "flex";
            noteOnlyToolbar.style.display = "flex";

            currentlyLoadedNote = name;
        }
    })
    .catch(error => console.error(error));
}

async function editTagsMenuGUI(){
    resetScreen();
    await loadTagsGUI();
    editTagsMenu.style.display = "flex";
}

function closeEditTagsMenuGUI(){
    resetScreen();
    notepad.style.display = "flex";
    noteOnlyToolbar.style.display = "flex";
}

async function loadTagsGUI(){
    var loaded = await new Promise ((resolve, reject) => {
        fetch('/loadtags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "name" : currentlyLoadedNote })
        })
        .then(response => response.json())
        .then(data => {
            resolve(true);

            var editTagsMenuTagContainer = document.getElementById('editTagsMenuTagContainer');

            editTagsMenuTagContainer.innerHTML = "";

            for (var tag of data){
                var tagMenuTag = document.createElement("div");
                tagMenuTag.className = "tag-menu-tag";
                editTagsMenuTagContainer.appendChild(tagMenuTag);

                var tagMenuTagName = document.createElement("h4");
                tagMenuTagName.textContent = tag;
                tagMenuTag.appendChild(tagMenuTagName);

                var tagMenuTagImg = document.createElement("img");
                tagMenuTagImg.src = "/media/icons/tagmenus/deletetag.svg";
                tagMenuTagImg.setAttribute("onclick", "removeTag('"+tag+"')");
                tagMenuTag.appendChild(tagMenuTagImg);
            }
        })
        .catch(error => {
            console.error(error);
            resolve(false);
        });
    });

    if (!loaded){
        alert("error while loading tags. Check developer console.")
    } else {
        return true;
    }
}

function addTag(){
    var addTagNameInput = document.getElementById("addTagNameInput");

    fetch('/addtag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : currentlyLoadedNote, "tag" : addTagNameInput.value })
    })
    .then(response => response.json())
    .then(data => {
        loadTagsGUI();
        alert(data);
    })
    .catch(error => console.error(error));
}

function removeTag(tag){
    fetch('/removetag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name" : currentlyLoadedNote, "tag" : tag })
    })
    .then(response => response.json())
    .then(data => {
        loadTagsGUI();
        alert(data);
    })
    .catch(error => console.error(error));
}

start();
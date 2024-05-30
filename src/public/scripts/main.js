const notepad = document.getElementById("notepad");

//Popups
const popupContainer = document.getElementById("popupContainer");
const createNewNotePopup = document.getElementById("createNewNotePopup");
const noteTagsPopup = document.getElementById("noteTagsPopup");
const noteSettingsPopup = document.getElementById("noteSettingsPopup");

//Account
const accountMenu = document.getElementById("accountMenu");
const loginMenu = document.getElementById("loginMenu");
const signupMenu = document.getElementById("signupMenu");
const accountSettingsMenu = document.getElementById("accountSettingsMenu");

//Search
const notesSidebarSearch = document.getElementById("notesSidebarSearch");

var notepadSaved = true;
var currentlyLoadedNote = "";
var loggedin = false;

var inClientNotes = [];

class clientNote {
    constructor(name, UUID, body, tags) {
        this.name = name;
        this.UUID = UUID;
        this.body = body;
        this.tags = tags;
    }
}

function resetScreen() {
    popupContainer.style.display = "none";
    createNewNotePopup.style.display = "none";
    noteTagsPopup.style.display = "none";
    noteSettingsPopup.style.display = "none";

    accountMenu.style.display = "none";
    loginMenu.style.display = "none";
    signupMenu.style.display = "none";
    accountSettingsMenu.style.display = "none";

    notesSidebarSearch.value = "";
    loadNotes();
}

function start() {
    resetScreen();
    notepad.value = "";
    notepad.placeholder =
        "Welcome to Notely. To begin please login / signup and begin writing notes.";
    notepad.disabled = true;
}

//notes

function createNewNoteGUI() {
    resetScreen();
    popupContainer.style.display = "flex";
    createNewNotePopup.style.display = "flex";
}

function createNewNote() {
    var newNoteNameInput = document.getElementById("newNoteNameInput");

    fetch("/createnote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newNoteNameInput.value }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message == "I001: The note was created successfully.") {
                resetScreen();
                currentlyLoadedNote = newNoteNameInput.value;
                newNoteNameInput.value = "";
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error(error));
}

function saveNote() {
    if (!currentlyLoadedNote) {
        alert("W001: No note is currently loaded.");
        return;
    }

    fetch("/savenote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            UUID: currentlyLoadedNote,
            body: notepad.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            notepadSaved = true;
            alert(data.message);
        })
        .catch((error) => console.error(error));
}

function loadNotes() {
    var notesSidebarSearch = document.getElementById("notesSidebarSearch");

    fetch("/listnotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: notesSidebarSearch.value }),
    })
        .then((response) => response.json())
        .then((data) => {
            populateNotesSidebar(data);
        })
        .catch((error) => console.error(error));
}

function populateNotesSidebar(data) {
    var notesSidebarContainer = document.getElementById(
        "notesSidebarContainer",
    );

    notesSidebarContainer.innerHTML = "";

    for (var note of data.notes) {
        var noteViewNote = document.createElement("div");
        noteViewNote.className = "sidebar-note";
        noteViewNote.setAttribute("onclick", "loadNote('" + note[2] + "')");
        noteViewNote.setAttribute("id", note[2]);
        notesSidebarContainer.appendChild(noteViewNote);

        var noteViewNoteName = document.createElement("h3");
        noteViewNoteName.textContent = note[0];
        noteViewNote.appendChild(noteViewNoteName);

        var inClientNote = new clientNote(note[0], note[2], note[1], note[3]);
        inClientNotes.push(inClientNote);
    }
}

function loadNote(UUID) {
    fetch("/loadnote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UUID: UUID }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (
                data.note == "E005: No note with the specified name exists." ||
                data.note ==
                    "E007: The note could not be loaded. If you are running this instance of Notely locally please check the server console."
            ) {
                alert(data.note);
            } else {
                resetScreen();
                notepad.value = "";

                data = JSON.parse(data);

                notepad.value = data.body;
                notepad.placeholder = "You are editing: " + data.name + "...";
                notepad.disabled = false;
                prepareStringForParsing();
                currentlyLoadedNote = UUID;
            }
        })
        .catch((error) => console.error(error));
}

function noteSettingsGUI() {
    if (!currentlyLoadedNote) {
        alert("W001: No note is currently loaded.");
        return;
    }

    resetScreen();
    popupContainer.style.display = "flex";
    noteSettingsPopup.style.display = "flex";
}

function closeNoteSettingsGUI() {
    resetScreen();
}

function deleteNote() {
    if (!currentlyLoadedNote) {
        alert("W001: No note is currently loaded.");
        return;
    }

    fetch("/deletenote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UUID: currentlyLoadedNote }),
    })
        .then((response) => response.json())
        .then((data) => {
            currentlyLoadedNote = "";
            resetScreen();
            notepad.value =
                "Welcome to Notely. To begin please login / signup, then load a note and begin writing.";
            markdownViewer.innerHTML = "";
            alert(data);
        })
        .catch((error) => console.error(error));
}

//tags

async function tagsMenuGUI() {
    if (!currentlyLoadedNote) {
        alert("W001: No note is currently loaded.");
        return;
    }

    resetScreen();
    await loadTagsGUI();
    popupContainer.style.display = "flex";
    noteTagsPopup.style.display = "flex";
}

function closeTagsMenuGUI() {
    resetScreen();
}

async function loadTagsGUI() {
    var loaded = await new Promise((resolve, reject) => {
        fetch("/loadtags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: currentlyLoadedNote }),
        })
            .then((response) => response.json())
            .then((data) => {
                resolve(true);

                var tagsContainer = document.getElementById("tagsContainer");

                tagsContainer.innerHTML = "";

                for (var tag of data) {
                    var tagMenuTag = document.createElement("div");
                    tagMenuTag.className = "tag-menu-tag";
                    tagsContainer.appendChild(tagMenuTag);

                    var tagMenuTagName = document.createElement("h4");
                    tagMenuTagName.textContent = tag;
                    tagMenuTag.appendChild(tagMenuTagName);

                    var tagMenuTagImg = document.createElement("img");
                    tagMenuTagImg.src = "/media/icons/tagmenus/deletetag.svg";
                    tagMenuTagImg.setAttribute(
                        "onclick",
                        "removeTag('" + tag + "')",
                    );
                    tagMenuTag.appendChild(tagMenuTagImg);
                }
            })
            .catch((error) => {
                console.error(error);
                resolve(false);
            });
    });

    if (!loaded) {
        alert("error while loading tags. Check developer console.");
    } else {
        return true;
    }
}

function addTag() {
    var addTagInput = document.getElementById("addTagInput");

    fetch("/addtag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            UUID: currentlyLoadedNote,
            tag: addTagInput.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            addTagInput.value = "";
            loadTagsGUI();
            alert(data);
        })
        .catch((error) => console.error(error));
}

function removeTag(tag) {
    fetch("/removetag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UUID: currentlyLoadedNote, tag: tag }),
    })
        .then((response) => response.json())
        .then((data) => {
            loadTagsGUI();
            alert(data);
        })
        .catch((error) => console.error(error));
}

//Account stuff

function accountGUI() {
    resetScreen();
    popupContainer.style.display = "flex";
    accountMenu.style.display = "flex";

    if (!loggedin) {
        loginMenu.style.display = "flex";
    } else {
        accountSettingsMenu.style.display = "flex";
    }
}

function toggleLoginSignupGUI() {
    popupContainer.style.display = "flex";
    accountMenu.style.display = "flex";

    if (loginMenu.style.display == "flex") {
        loginMenu.style.display = "none";
        signupMenu.style.display = "flex";
    } else {
        loginMenu.style.display = "flex";
        signupMenu.style.display = "none";
    }
}

function submitSignupRequest() {
    const signupEmailInput = document.getElementById("signupEmailInput");
    const signupPasswordInput = document.getElementById("signupPasswordInput");

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: signupEmailInput.value,
            password: signupPasswordInput.value,
            token: grecaptcha.getResponse(),
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data);

            if (
                data == "I007: Account was created successfully." ||
                data ==
                    "E014: Account with this email already exists. Please login instead."
            ) {
                signupEmailInput.value = "";
                signupPasswordInput.value = "";
                toggleLoginSignupGUI();
            }
        })
        .catch((error) => console.error(error));
}

function submitLoginRequest() {
    const loginMenuEmailInput = document.getElementById("loginMenuEmailInput");
    const loginMenuPasswordInput = document.getElementById(
        "loginMenuPasswordInput",
    );

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: loginMenuEmailInput.value,
            password: loginMenuPasswordInput.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data);

            if (
                data ==
                "E012: Account with this email does not exist. Please create a new account."
            ) {
                toggleLoginSignupGUI();
            } else if (data == "I006: Account was logged in successfully.") {
                loginMenuEmailInput.value - "";
                loginMenuPasswordInput.value = "";
                resetScreen();
                loggedin = true;
            }
        })
        .catch((error) => console.error(error));
}

function submitLogoutRequest() {
    fetch("/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data);

            resetScreen();
            start();
            loggedin = false;
            markdownViewer.innerHTML = "";
            currentlyLoadedNote = null;
        })
        .catch((error) => console.error(error));
}

//search stuff

function searchNotes() {
    var searchInput = notesSidebarSearch.value;

    console.log(searchInput);

    if (searchInput != "") {
        //TODO: Refactor and simplify (THIS IS A FUCKING MESS) never nest my ass
        for (var note of inClientNotes) {
            if (!note.name.includes(searchInput)) {
                //console.log(note.name, "doesn't contain", searchInput)

                if (!note.body.includes(searchInput)) {
                    //console.log(note.body, "doesn't contain", searchInput)

                    if (!note.tags.length == 0) {
                        for (var tag of note.tags) {
                            if (!tag.includes(searchInput)) {
                                //console.log(note.name, tag, "doesn't contain", searchInput)

                                var noteInDocument = document.getElementById(
                                    note.UUID,
                                );
                                console.log(note.name, note.UUID);
                                noteInDocument.style.display = "none";
                            }
                        }
                    } else {
                        var noteInDocument = document.getElementById(note.UUID);
                        //console.log(note.name, note.UUID)
                        noteInDocument.style.display = "none";
                    }
                } else {
                    var noteInDocument = document.getElementById(note.UUID);
                    //console.log(note.name, note.UUID)
                    noteInDocument.style.display = "flex";
                }
            } else {
                var noteInDocument = document.getElementById(note.UUID);
                //console.log(note.name, note.UUID)
                noteInDocument.style.display = "flex";
            }
        }
    } else {
        resetScreen();
    }
}

// autoSave

function autoSave() {
    setInterval(() => {
        if (loggedin == true && currentlyLoadedNote) {
            fetch("/savenote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UUID: currentlyLoadedNote,
                    body: notepad.value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    notepadSaved = true;
                })
                .catch((error) => console.error(error));
        }
    }, 10000);
}

notesSidebarSearch.addEventListener("input", searchNotes);

autoSave();
start();

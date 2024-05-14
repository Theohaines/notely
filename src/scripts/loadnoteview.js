const fs = require('fs');
const path = require('path');

async function loadNoteView(name, tag){
    console.log(name, tag);

    if(name != ""){
        var notes = await loadNoteViewByName(name);
        return notes;
    } else if (tag != ""){
        var notes = await loadNoteViewByTag(tag);
        return notes;
    } else {
        var notes = await loadNoteViewByAll();

        var sortedNotes = [];
        
        for (var note of notes){
            sortedNotes.push(await sortNotes(note));
        }

        return sortedNotes;
    }
}

async function loadNoteViewByName(name){

}

async function loadNoteViewByTag(tag){
    
}

async function loadNoteViewByAll(){
    var notes = new Promise ((resolve, reject) => {
        fs.readdir("src/notes", (err, files) => {
            resolve(files);
        });
    });

    return notes;
}

async function sortNotes(note){
    var noteContents = new Promise ((resolve, reject) => {
        fs.readFile(path.resolve("src/notes/" + note), 'utf8', (err, contents) => {
            resolve([note, contents]);
        });
    });

    return noteContents;
}

module.exports = { loadNoteView }
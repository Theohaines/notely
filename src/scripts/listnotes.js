const fs = require('fs');
const path = require('path');

async function listNotes(name, tag){
    var validatedFilesSearch = await composeNotesByAll();

    if (!validatedFilesSearch){
        return "couldn't load notes. if locally hosted check server console";
    }

    return validatedFilesSearch;
}

async function listNotesByAll(){
    var validated = await new Promise ((resolve, reject) => {

        fs.readdir(path.resolve('src/notes/'), (err, files) => {
            if (err){
                resolve(false);
            }

            resolve(files);
        });
    })

    if (!validated){
        return false;
    } else {
        return validated;
    }
}

async function composeNotesByAll(){
    const files = await listNotesByAll();
    var composedNotes = [];

    var validated = await new Promise((resolve, reject) => {
        files.forEach(file => {
            var data = fs.readFileSync(path.resolve('src/notes/' + file), 'utf-8');

            var parsedJSON = JSON.parse(data);
            composedNotes.push([file.replace(".json", ""), parsedJSON.body]);
        });

        resolve(true)
    });

    if (!validated){
        return false;
    } else {
        return composedNotes;
    }
}

module.exports = { listNotes }
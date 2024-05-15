const fs = require('fs');
const path = require('path');

async function loadNote(name){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validateNoteLoaded = await loadNoteUsingFS(name);

    if (!validateNoteLoaded){
        return "note could not be loaded."
    }

    return validateNoteLoaded;
}

async function validatedNoteExists(name){
    var filepath = path.resolve('src/notes');

    var validated = await new Promise ((resolve, reject) => {
        fs.readFile(filepath + "/" + name + ".json", 'utf8', (err, data) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

async function loadNoteUsingFS(name){
    var validated = await new Promise((resolve, reject) => {
        fs.readFile(path.resolve('src/notes/' + name + '.json'), 'utf-8', (err, data) => {
            if (err){
                resolve(false);
            }    

            resolve(data);
        });
    });

    if (!validated){
        return false;
    } else {
        return validated;
    }
}

module.exports = { loadNote }
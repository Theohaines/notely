const fs = require('fs');
const path = require('path');

async function deleteNote(name){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validatedSaved = await deleteNoteUsingFS(name);

    if (!validatedSaved){
        return "note could not be deleted. If running locally check the server console.";
    }

    return "note deleted.";
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

async function deleteNoteUsingFS(name){
    var filepath = path.resolve('src/notes/' + name + '.json');

    var validated = await new Promise ((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err){
                resolve(false);
            }
            
            resolve(true);
        });
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

module.exports = { deleteNote }
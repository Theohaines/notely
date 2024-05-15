const { json } = require('express');
const fs = require('fs');
const path = require('path');

async function saveNote(name, body){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validatedSaved = await saveNoteUsingFS(name, body);

    if (!validatedSaved){
        return "note could not be saved. If running locally check the server console.";
    }

    return "note saved.";
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

async function saveNoteUsingFS(name, body){
    var filepath = path.resolve('src/notes/' + name + '.json');

    var validated = await new Promise ((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err){
                resolve(false);
            }

            var existingJSON = JSON.parse(data);
            existingJSON.body = body;
    
            fs.writeFile(filepath, JSON.stringify(existingJSON, null, 2), (err) => {
                if (err){
                    resolve(false);
                } else {
                    resolve(true);
                }
            });     
        });
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

module.exports = { saveNote }
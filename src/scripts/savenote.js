const fs = require('fs');
const path = require('path');

const toolkit = require('./reuseable/toolkit.js');

async function saveNote(account, UUID, body){
    var validateOwnership = await toolkit.validateOwnershipViaUUID(account, UUID);

    if (!validateOwnership){
        return "E004";
    }

    var validatedExists = await validatedNoteExists(UUID);

    if (!validatedExists){
        return "E005"
    }

    var validatedSaved = await saveNoteUsingFS(UUID, body);

    if (!validatedSaved){
        return "E006";
    }

    return "I002";
}

async function validatedNoteExists(UUID){
    var filepath = path.resolve('src/notes');

    var validated = await new Promise ((resolve, reject) => {
        fs.readFile(filepath + "/" + UUID + ".json", 'utf8', (err, data) => {
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

async function saveNoteUsingFS(UUID, body){
    var filepath = path.resolve('src/notes/' + UUID + '.json');

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
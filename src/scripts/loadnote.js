const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const toolkit = require('./reuseable/toolkit.js');

async function loadNote(account, UUID){
    var validatedNoteOwnership = await toolkit.validateOwnershipViaUUID(account, UUID)

    if (!validatedNoteOwnership){
        return await toolkit.transalateMessage("E004");
    }

    var validatedExists = await toolkit.validatedNoteExists(UUID);

    if (!validatedExists){
        return await toolkit.transalateMessage("E005");
    }

    var validateNoteLoaded = await loadNoteUsingFS(UUID);

    if (!validateNoteLoaded){
        return await toolkit.transalateMessage("E007");
    }

    return validateNoteLoaded;
}

async function loadNoteUsingFS(UUID){
    var validated = await new Promise((resolve, reject) => {
        fs.readFile(path.resolve('src/notes/' + UUID + '.json'), 'utf-8', (err, data) => {
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
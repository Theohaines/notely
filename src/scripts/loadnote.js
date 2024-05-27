const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const toolkit = require('./reuseable/toolkit.js');

async function loadNote(account, UUID){
    var validatedNoteOwnership = await validateNoteOwnership(account, UUID)

    if (!validatedNoteOwnership){
        return await toolkit.transalateMessage("E004");
    }

    var validatedExists = await validatedNoteExists(UUID);

    if (!validatedExists){
        return await toolkit.transalateMessage("E005");
    }

    var validateNoteLoaded = await loadNoteUsingFS(UUID);

    if (!validateNoteLoaded){
        return await toolkit.transalateMessage("E007");
    }

    return validateNoteLoaded;
}

async function validateNoteOwnership(account, UUID){
    var validated = await new Promise ((resolve, reject) => {
        var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

        db.get('SELECT * FROM notes WHERE N_UUID = ?', [UUID], (err, row) => {
            if (err){
                console.log(err);
            }

            if (row.N_OWNER == account){
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
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
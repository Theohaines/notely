const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

async function loadNote(account, UUID){
    var validatedNoteOwnership = await validateNoteOwnership(account, UUID)

    if (!validatedNoteOwnership){
        return "you don't own the specified note";
    }

    var validatedExists = await validatedNoteExists(UUID);

    if (!validatedExists){
        return "no note with the specified name exists.";
    }

    var validateNoteLoaded = await loadNoteUsingFS(UUID);

    if (!validateNoteLoaded){
        return "note could not be loaded.";
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

            console.log(data)

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
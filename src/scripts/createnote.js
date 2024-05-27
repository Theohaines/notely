const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sqlite3 = require('sqlite3');

const filenameRexex = /^[a-zA-Z0-9._-]]]+$/;
 
// THIS TEMPLATE CAN BE EDITED TO ALTER THE NOTES SYS
var templateNote = `
{
    "body" : "",
    "tags" : [

    ],
    "owner" : "local",
    "name" : ""
}

`

async function createNote(name, loggedInUser){
    var validatedName = await validateNoteName(name, loggedInUser);

    if (!validatedName){
        return "E001";
    }

    var validatedExistance = await validatedNoteNotExist(name);

    if (!validatedExistance){
        return "E002";
    }

    var validateNoteCreated = await createNoteWithFS(name, loggedInUser);

    if (!validateNoteCreated){
        return "E003";
    }

    return "I001";
}

async function validateNoteName(name){
    var validated = await new Promise ((resolve, reject) => {
        if (!name){
            resolve(false);
        }

        if (name.length > 60){
            resolve(false);
        }

        if (name.length < 3){
            resolve(false);
        }

        if (!filenameRexex.test){
            resolve(false);
        }

        resolve(true);
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

async function validatedNoteNotExist(name){
    var filepath = path.resolve('src/notes/');

    var validated = await new Promise ((resolve, reject) => {
        fs.readFile(filepath + name + ".json", (err, data) => {
            if (!err && data) {
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

async function createNoteWithFS(name, loggedInUser){
    const fileUUID = crypto.randomUUID();
    var filepath = path.resolve('src/notes/' + fileUUID + ".json");

    if(loggedInUser){
        templateNote = JSON.parse(templateNote);

        templateNote.owner = loggedInUser;
        templateNote.name = name;

        templateNote = JSON.stringify(templateNote);
    }

    var validated = await new Promise ((resolve, reject) => {
        fs.writeFile(filepath, templateNote, 'utf8', (err) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(true)
        });
    });

    templateNote = `
    {
        "body" : "",
        "tags" : [
    
        ],
        "owner" : "local",
        "name" : ""
    }

    `

    if (!validated){
        return false;
    }

    validated = await new Promise ((resolve, reject) => {
        var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

        db.run('INSERT INTO notes (N_UUID, N_OWNER) VALUES (?, ?)', [fileUUID, loggedInUser], (err, row) => {
            if(err){
                console.log(err);
                resolve(false)
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

module.exports = { createNote }
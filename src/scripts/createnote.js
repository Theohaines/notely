const fs = require('fs');
const path = require('path');

const filenameRexex = /^[a-zA-Z0-9._-]]]+$/;
 
// THIS TEMPLATE CAN BE EDITED TO ALTER THE NOTES SYS
const templateNote = `
{
    "body" : "",
    "tags" : [

    ]
}

`

async function createNote(name){
    var validatedName = await validateNoteName(name);

    if (!validatedName){
        return "Illegal note name.";
    }

    var validatedExistance = await validatedNoteNotExist(name);

    if (!validatedExistance){
        return "Note with same name already exists.";
    }

    var validateNoteCreated = await createNoteWithFS(name);

    if (!validateNoteCreated){
        return "Note could not be created, if locally hosted check the server console output.";
    }

    return "ok";
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

async function createNoteWithFS(name){
    var filepath = path.resolve('src/notes/' + name + ".json");

    var validated = await new Promise ((resolve, reject) => {
        fs.writeFile(filepath, templateNote, 'utf8', (err) => {
            if (err){
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

module.exports = { createNote }
const fs = require('fs');
const path = require('path');

const noteNameRegex =  /^[\w,\s-]+\.[A-Za-z]{3}$/;

async function createNote(noteName){
    var validated = await checkNoteNotExist(noteName);

    if (!validated){
        return "Note with same name already exists."
    }

    validated = await validateNoteName(noteName + ".txt");

    if (!validated){
        return "name is too long, too short or contains illegal characters."
    }

    createNoteUsingFS(noteName);

    return "note created!"
}

async function checkNoteNotExist(noteName){ //Checks if a note with the same name already exists
    var notePath = path.resolve('src/notes/' + noteName + ".txt");

    var exists = await new Promise ((resolve, reject) => {
        fs.stat(notePath, (err, stats) => {
            if (err) {
                console.log(`The file or directory at '${notePath}' does not exist.`);
                resolve(true);
            } else {
                console.log(`The file or directory at '${notePath}' exists.`);
                resolve(false);
            }
        });
    })

    if (!exists){
        return false;
    }

    return true;
}

async function validateNoteName(noteName){
    var validated = await new Promise ((resolve, reject) => {
        if (!noteNameRegex.test(noteName)){
            resolve(false);
        }
    
        if (noteName.length > 60){
            resolve(false);
        }

        if (noteName.length < 3){
            resolve(false);
        }

        resolve(true);
    });
    
    if (!validated){
        return false;
    }

    return true;
}

async function createNoteUsingFS(noteName){
    var notePath = path.resolve('src/notes/' + noteName + ".txt");

    fs.writeFile(notePath, "", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

module.exports = { createNote }
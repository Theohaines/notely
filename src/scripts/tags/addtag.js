const fs = require('fs');
const path = require('path');

const toolkit = require('../reuseable/toolkit.js');

async function addTag(account, UUID, tag){
    var validateOwnership = await toolkit.validateOwnershipViaUUID(account, UUID);

    if (!validateOwnership){
        return "You do not own the specified note!";
    }

    var validatedExists = await validatedNoteExists(UUID);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validatedAddTag = await addTagUsingFS(UUID, tag);

    if (!validatedAddTag){
        return "Tag could not be added."
    }

    return "Tag added."
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

async function addTagUsingFS(UUID, tag){
    var filepath = path.resolve('src/notes/' + UUID + '.json');

    var validated = await new Promise ((resolve, reject) => {
        var data = fs.readFileSync(filepath, 'utf8');

        var parsedJSON = JSON.parse(data);
        parsedJSON.tags.push(tag);

        fs.writeFile(filepath, JSON.stringify(parsedJSON, null, 2), (err) => {
            if (err){
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

module.exports = { addTag }
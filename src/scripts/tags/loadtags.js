const fs = require('fs');
const path = require('path');

async function loadTags(name){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var tags = await loadTagsUsingFS(name);

    if (!tags){
        return "tags could not be loaded. if locally hosted check server console";
    }

    return tags;
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

async function loadTagsUsingFS(name){
    var validated = await new Promise((resolve, reject) => {
        var data = fs.readFileSync(path.resolve('src/notes/' + name + '.json'), 'utf-8');
        
        parsedJSON = JSON.parse(data);
        resolve(parsedJSON.tags);
    });

    if (!validated){
        return false;
    } else {
        return validated;
    }
}

module.exports = { loadTags }
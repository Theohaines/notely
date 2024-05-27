const fs = require('fs');
const path = require('path');

const toolkit = require('../reuseable/toolkit.js');

async function loadTags(name){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return await toolkit.transalateMessage("E005");
    }

    var tags = await loadTagsUsingFS(name);

    if (!tags){
        return await toolkit.transalateMessage("E011");;
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
const fs = require('fs');
const path = require('path');

const toolkit = require('../reuseable/toolkit.js');

async function loadTags(name){
    var validatedExists = await toolkit.validatedNoteExists(name);

    if (!validatedExists){
        return await toolkit.transalateMessage("E005");
    }

    var tags = await loadTagsUsingFS(name);

    if (!tags){
        return await toolkit.transalateMessage("E011");;
    }

    return tags;
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
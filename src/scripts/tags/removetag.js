const fs = require('fs');
const path = require('path');

async function removeTag(name, tag){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validatedRemoveTag = await removeTagUsingFS(name, tag);

    if (!validatedRemoveTag){
        return "Tag could not be removed."
    }

    return "Tag removed."
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

async function removeTagUsingFS(name, tag){
    var filepath = path.resolve('src/notes/' + name + '.json');

    var validated = await new Promise ((resolve, reject) => {
        var data = fs.readFileSync(filepath, 'utf8');

        var parsedJSON = JSON.parse(data);
        parsedJSON.tags = parsedJSON.tags.filter(e => e !== tag);

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

module.exports = { removeTag }
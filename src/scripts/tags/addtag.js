const fs = require('fs');
const path = require('path');

async function addTag(name, tag){
    var validatedExists = await validatedNoteExists(name);

    if (!validatedExists){
        return "no note with the specified name exists."
    }

    var validatedAddTag = await addTagUsingFS(name, tag);

    if (!validatedAddTag){
        return "Tag could not be added."
    }

    return "Tag added."
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

async function addTagUsingFS(name, tag){
    var filepath = path.resolve('src/notes/' + name + '.json');

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
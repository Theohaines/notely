const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");

const toolkit = require("./reuseable/toolkit.js");

async function listNotes(account) {
    var validatedFilesSearchByAccount = await composeNotesByAllAccount(account);

    if (!validatedFilesSearchByAccount) {
        return await toolkit.transalateMessage("E019");
    }

    return validatedFilesSearchByAccount;
}

async function listNotesByAllAccount(account) {
    var validated = await new Promise((resolve, reject) => {
        var db = new sqlite3.Database(
            path.resolve("src/databases/notely.sqlite"),
        );

        db.all(
            "SELECT N_UUID FROM notes WHERE N_OWNER = ?",
            [account],
            (err, rows) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }

                resolve(rows);
            },
        );
    });

    if (!validated) {
        return false;
    } else {
        return validated;
    }
}

async function composeNotesByAllAccount(account) {
    const files = await listNotesByAllAccount(account);
    var composedNotes = [];

    var validated = await new Promise((resolve, reject) => {
        files.forEach((file) => {
            var data = fs.readFileSync(
                path.resolve("src/notes/" + file.N_UUID + ".json"),
                "utf-8",
            );

            var parsedJSON = JSON.parse(data);
            composedNotes.push([
                parsedJSON.name,
                parsedJSON.body,
                file.N_UUID,
                parsedJSON.tags,
            ]); // [name, body, UUID, tags]
        });

        resolve(true);
    });

    if (!validated) {
        return false;
    } else {
        return composedNotes;
    }
}

module.exports = { listNotes };

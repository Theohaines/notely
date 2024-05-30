const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");

const toolkit = require("./reuseable/toolkit.js");

async function deleteNote(account, UUID) {
    var validatedNoteOwnership = await toolkit.validateOwnershipViaUUID(
        account,
        UUID,
    );

    if (!validatedNoteOwnership) {
        return "E004";
    }

    var validatedExists = await toolkit.validatedNoteExists(UUID);

    if (!validatedExists) {
        return "E005";
    }

    var validatedSaved = await deleteNoteUsingFS(UUID);

    if (!validatedSaved) {
        return "E008";
    }

    return "I003";
}

async function deleteNoteUsingFS(UUID) {
    var filepath = path.resolve("src/notes/" + UUID + ".json");

    var validated = await new Promise((resolve, reject) => {
        var db = new sqlite3.Database(
            path.resolve("src/databases/notely.sqlite"),
        );

        db.get("DELETE FROM notes WHERE N_UUID = ?", [UUID], (err, row) => {
            if (err) {
                console.log(err);
                resolve(false);
            }

            resolve(true);
        });
    });

    if (!validated) {
        return false;
    }

    validated = await new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                resolve(false);
            }

            resolve(true);
        });
    });

    if (!validated) {
        return false;
    } else {
        return true;
    }
}

module.exports = { deleteNote };

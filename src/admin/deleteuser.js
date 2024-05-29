const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

var userEmail = "";
var lockaccount = true;

async function deleteUser(){
    var validatedAllNotesRemoved = await deleteAllNotes();

    if (!validatedAllNotesRemoved){
        console.error("couldnt remove all notes from db")
    }

    var validatedAllNotesRemovedFromDB = await deleteAllNotesFromDB();

    if (!validatedAllNotesRemovedFromDB){
        console.error("couldnt remove all notes from db")
    }

    var validatedUserAccount = await blockUserAccount();

    if (!validatedAllNotesRemovedFromDB){
        console.error("couldnt remove all notes from db")
    }
}

async function deleteAllNotes(){
    var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

    var validated = await new Promise((resolve, reject) => {
        db.all('SELECT N_UUID FROM notes WHERE N_OWNER = ?', [userEmail], (err, rows) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            for (var note of rows){
                var filepath = path.resolve('src/notes') + "/" + note.N_UUID + ".json";

                fs.unlink(filepath, (err) => {

                });
                console.log("Removed from note folder:", note.N_UUID);
            }

            resolve(true);
        })
    })

    if (!validated){
        return false;
    }

    return true;
}

async function deleteAllNotesFromDB(){
    var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

    var validated = await new Promise((resolve, reject) => {
        db.run('DELETE FROM notes WHERE N_OWNER = ?', [userEmail], (err) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(true);
        })
    })

    if (!validated){
        return false;
    }

    return true;
}

async function blockUserAccount(){
    var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

    var validated = await new Promise((resolve, reject) => {
        if (lockaccount == false){
            db.run('DELETE FROM accounts WHERE A_EMAIL = ?', [userEmail], (err) => {
                if (err){
                    console.log(err);
                    resolve(false);
                }
    
                resolve(true);
            })
        } else {
            db.run('UPDATE accounts SET A_PASSWORD = ? WHERE A_EMAIL = ?', [Math.random(), userEmail], (err) => {
                if (err){
                    console.log(err);
                    resolve(false);
                }
    
                resolve(true);
            })
        }
    })

    if (!validated){
        return false;
    }

    return true;
}

deleteUser();
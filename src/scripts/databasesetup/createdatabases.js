const sqlite3 = require('sqlite3');
const path = require('path');

const sql = `CREATE TABLE accounts
            (
                A_ID INTEGER PRIMARY sqKEY AUTOINCREMENT,
                A_EMAIL varchar(320),
                A_PASSWORD text
            )`

function createDatabase(){
    const db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'), (err) => {
        if (err){
            console.log(err)
            return;
        }

        console.log('Created sqlite3 db "notely.sqlite"');
        setupDatabase();
    });
}

function setupDatabase(){
    const db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

    db.run(sql, (err) => {
        if (err){
            console.log(err);
            return;
        }

        console.log("ran sql:", sql);
    })
}

createDatabase();
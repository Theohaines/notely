const sqlite3 = require("sqlite3");
const path = require("path");

const accountsSQL = `CREATE TABLE accounts
            (
                A_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                A_EMAIL varchar(320),
                A_PASSWORD text
            )`;

const notesSQL = `CREATE TABLE notes
            (
                N_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                N_UUID text,
                N_OWNER TEXT,
                FOREIGN KEY (N_OWNER)
                REFERENCES accounts (A_EMAIL)
                ON DELETE SET NULL
            )`;

function createDatabase() {
    const db = new sqlite3.Database(
        path.resolve("src/databases/notely.sqlite"),
        (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Created sqlite3 db "notely.sqlite"');
            setupDatabase();
        },
    );
}

function setupDatabase() {
    const db = new sqlite3.Database(
        path.resolve("src/databases/notely.sqlite"),
    );

    db.run(notesSQL, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log("ran sql:", notesSQL);
    });

    db.run(accountsSQL, (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log("ran sql:", accountsSQL);
    });
}

createDatabase();

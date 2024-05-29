const sqlite3 = require('sqlite3');
const path = require('path');

async function listAll(){
    var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));


    db.all('SELECT * FROM notes', (err, rows) => {
        if (err){
            console.log(err);
        }

        for (var note of rows){
            console.log(note);
        }
    })
}

listAll();
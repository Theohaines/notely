const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

async function login(email, password) {
  var emailExistsValidated = await valdateEmailExists(email);

  if (!emailExistsValidated) {
    return "E012";
  }

  var validateLoggedIn = await loginAccount(email, password);

  if (!validateLoggedIn) {
    return "E013";
  } else {
    return "I006";
  }
}

async function valdateEmailExists(email) {
  var validated = await new Promise((resolve, reject) => {
    var db = new sqlite3.Database(path.resolve("src/databases/notely.sqlite"));

    db.all("SELECT * FROM accounts WHERE A_EMAIL = ?", [email], (err, rows) => {
      if (err) {
        console.log(err);
        resolve(false);
      }

      if (rows.length >= 1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });

  if (!validated) {
    return false;
  } else {
    return true;
  }
}

async function loginAccount(email, password) {
  var validated = await new Promise((resolve, reject) => {
    var db = new sqlite3.Database(path.resolve("src/databases/notely.sqlite"));

    db.all("SELECT * FROM accounts WHERE A_EMAIL = ?", [email], (err, rows) => {
      if (err) {
        resolve(false);
      }

      bcrypt
        .compare(password, rows[0].A_PASSWORD)
        .then((res) => {
          if (!res) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch((err) => console.error(err.message));
    });
  });

  if (!validated) {
    return false;
  } else {
    return true;
  }
}

module.exports = { login };

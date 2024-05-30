const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");

const messageList = require("../../json/messagelist.json");

async function validatedNoteExists(UUID) {
  var filepath = path.resolve("src/notes");

  var validated = await new Promise((resolve, reject) => {
    fs.readFile(filepath + "/" + UUID + ".json", "utf8", (err, data) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });

  if (!validated) {
    return false;
  } else {
    return true;
  }
}

async function validateOwnershipViaUUID(account, UUID) {
  var validated = await new Promise((resolve, reject) => {
    var db = new sqlite3.Database(path.resolve("src/databases/notely.sqlite"));

    db.get("SELECT * FROM notes WHERE N_UUID = ?", [UUID], (err, row) => {
      if (err) {
        console.log(err);
      }

      if (row.N_OWNER == account) {
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

async function transalateMessage(code) {
  var message = await new Promise((resolve, reject) => {
    for (var message in messageList) {
      if (message == code) {
        resolve(messageList[message]);
      }
    }
  });

  return message;
}

module.exports = {
  validateOwnershipViaUUID,
  transalateMessage,
  validatedNoteExists,
};

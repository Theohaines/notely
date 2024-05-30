//Custom markdown parser for JS
//written by Theo Haines @ Theohaines.xyz

var eachLine = [];
const notepad = document.getElementById("notepad");
const markdownViewer = document.getElementById("markdownViewer");

//Mark down terminology
// # = heading (up to H6)

//MD is processed line by line making this easier I think?
function prepareStringForParsing() {
    markdownViewer.innerHTML = "";
    var string = notepad.value;

    // code snippet found here: https://stackoverflow.com/questions/15131072/check-whether-string-contains-a-line-break
    eachLine = string.split("\n");

    console.log("Lines found: " + eachLine.length);
    for (var i = 0, l = eachLine.length; i < l; i++) {
        console.log("Line " + (i + 1) + ": " + eachLine[i]);
        checkStringForMarkdownIdentifiers(eachLine[i]);
    }
}

function checkStringForMarkdownIdentifiers(line) {
    //go through all possible markdown identifiers

    if (!line[0]) {
        return;
    }

    if (line[0].includes("#")) {
        //Check for heading
        parseHeading(line);
        return;
    } else if (line[0].includes("*")) {
        checkForItalicsOrBold(line);
        return;
    }

    insertIntoMarkdownViewer("<p>" + line + "</p>");
}

function parseHeading(line) {
    var headingSize = line.match(/#/g).length;

    if (headingSize > 6) {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
    }

    if (line[headingSize] != " ") {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
    }

    var lineToInsert = line.replaceAll("#", "");
    lineToInsert = lineToInsert.slice(1, lineToInsert.length);

    insertIntoMarkdownViewer(
        "<H" + headingSize + ">" + lineToInsert + "</H" + headingSize + ">",
    );
}

function checkForItalicsOrBold(line) {
    var numberOfAsterisks = line.match(/\*/g).length;

    if (numberOfAsterisks == 2) {
        var lineToInsert = line.replaceAll("*", "");
        insertIntoMarkdownViewer("<i>" + lineToInsert + "</i>");
    } else if (numberOfAsterisks == 4) {
        var lineToInsert = line.replaceAll("*", "");
        insertIntoMarkdownViewer("<strong>" + lineToInsert + "</strong>");
    } else if (numberOfAsterisks == 6) {
        var lineToInsert = line.replaceAll("*", "");
        insertIntoMarkdownViewer(
            "<strong><i>" + lineToInsert + "</i></strong>",
        );
    } else {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
    }
}

function insertIntoMarkdownViewer(elementToInsert) {
    //console.log(elementToInsert); <-- for debugging
    markdownViewer.innerHTML = markdownViewer.innerHTML + elementToInsert;
}

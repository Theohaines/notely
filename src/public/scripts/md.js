//Custom markdown parser for JS
//written by Theo Haines @ Theohaines.xyz

var eachLine = [];
const notepad = document.getElementById("notepad");
const markdownViewer = document.getElementById("markdownViewer");

var checkingForCode = false;
var codeStore = [];

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

        if (checkingForCode == true) {
            codeStore.push(eachLine[i]);
        }

        if (eachLine[i].includes("`")) {
            if (checkingForCode == false) {
                checkingForCode = true;
                codeStore.push(eachLine[i]);
            } else {
                checkingForCode = false;
                parseCode(codeStore);
                codeStore = [];
                continue;
            }
        }

        if (!checkingForCode) {
            checkStringForMarkdownIdentifiers(eachLine[i]);
        }
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
    } else if (line[0].includes(">")) {
        parseBlockQuote(line);
        return;
    } else if (line[0].includes("`")) {
        parseCode(line);
        return;
    } else if (line == "---") {
        insertIntoMarkdownViewer("<hr/>");
        return;
    } else if (line[0].includes("[")) {
        parseLink(line);
        return;
    }

    insertIntoMarkdownViewer("<p>" + line + "</p>");
}

function parseHeading(line) {
    var headingSize = line.match(/#/g).length;

    if (headingSize > 6) {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
        return;
    }

    if (line[headingSize] != " ") {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
        return;
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

function parseBlockQuote(line) {
    var numberOfBlockQuotes = line.match(/>/g).length;

    if (numberOfBlockQuotes > 1) {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
        return;
    }

    var lineToInsert = line.replaceAll(">", "");
    lineToInsert = lineToInsert.slice(1, lineToInsert.length);

    insertIntoMarkdownViewer("<blockquote>" + lineToInsert + "</blockquote>");
}

function parseCode(lines) {
    var lineToInsert = "";

    for (var line in lines) {
        lineToInsert = lineToInsert + lines[line].replaceAll("`", "") + "\n";
    }

    insertIntoMarkdownViewer(
        "<pre class='code'><code>" + lineToInsert + "</code></pre>",
    );
}

function parseLink(line) {
    var linkTitle = line.split("]");
    try {
        linkTitle = linkTitle[0].replaceAll("[", "");
    } catch {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
        return;
    }

    var link = line.split("(");
    try {
        link = link[1].replaceAll(")", "");
    } catch {
        insertIntoMarkdownViewer("<p>" + line + "</p>");
        return;
    }

    insertIntoMarkdownViewer("<a href='" + link + "'>" + linkTitle + "</a>");
}

function insertIntoMarkdownViewer(elementToInsert) {
    //console.log(elementToInsert); <-- for debugging
    markdownViewer.innerHTML = markdownViewer.innerHTML + elementToInsert;
}

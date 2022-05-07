const height = 6;
const width = 5;

let row = 0;
let col = 0;

let gameOver = false;

wordList = ["ba'an", "bå'ut", "båba'", "båbas", "å'ñao", "åbeha", "åbisa", "åbitu", "åbona", "åbonu", "åbubu", "åbusu", "chå'ka", "cha'ot", "chacha'", "chåchak", "chåda'", "kå'he", "kåban", "kåbo'", "kåcha'", "fa'et", "fåbot", "fache'", "fago'", "fagot", "fåhån"];
guessList = ["ba'an", "bå'ut", "båba'", "båbas", "å'ñao", "åbeha", "åbisa", "åbitu", "åbona", "åbonu", "åbubu", "åbusu", "chå'ka", "cha'ot", "chacha'", "chåchak", "chåda'", "kå'he", "kåban", "kåbo'", "kåcha'", "fa'et", "fåbot", "fache'", "fago'", "fagot", "fåhån"];
guessList = guessList.concat(guessList, wordList);

console.log("This is the list: " + guessList);

let word = translateWord(wordList[Math.floor(Math.random() * wordList.length)].toUpperCase());

console.log(word);

window.onload = function () {
    initialize();
}

function translateWord(chamoruWord) {
    let translatedWord = [];
    let letter = "";

    for (let i = 0; i < chamoruWord.length; i++) {
        if (chamoruWord[i] == "Å") {
            translatedWord.push("Z");
        }
        else if (chamoruWord[i] == "Ñ") {
            translatedWord.push("J");
        }
        else if (chamoruWord[i] == "C" && chamoruWord[i + 1] == "H") {
            translatedWord.push("C");
            i++;
        }
        else if (chamoruWord[i] == "N" && chamoruWord[i + 1] == "G") {
            translatedWord.push("V");
            i++;
        }
        else {
            translatedWord.push(chamoruWord[i]);
        }

    }

    console.log(translatedWord)

    return translatedWord;

}


function initialize() {

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = ""
            document.getElementById("board").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;
        /* Only allows alphabet keys, quote (glota in Chamoru), enter and backspace keys to work */
        if ("KeyA" <= e.code && e.code <= "KeyZ" || e.code == "Quote") {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerText == "") {
                    /* Re-assigns English keys to Chamoru letters overlapping letters stay the same */
                    if (e.code == "KeyJ") {
                        currTile.innerText = "Ñ";
                    }
                    else if (e.code == "KeyV") {
                        currTile.innerText = "NG";
                    }
                    else if (e.code == "KeyZ") {
                        currTile.innerText = "Å";
                    }
                    else if (e.code == "KeyC") {
                        currTile.innerText = "CH";
                    }
                    else if (e.code == "Quote") {
                        currTile.innerText = "'";
                    }
                    else {
                        currTile.innerText = e.code[3];
                    }
                    col += 1;

                    /* Removes unused English alphabet keys making them useless */
                    if (e.code == "KeyQ" || e.code == "KeyW" || e.code == "KeyX") {
                        currTile.innerText = ""
                        col -= 1;
                    }
                }
            }
        }
        else if (e.code == "Backspace") {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + "-" + col.toString());
            currTile.innerText = "";
        }
        else if (e.code == "Enter") {
            update();
        }


        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function update() {

    // CHECKS IF WORD IS A VALID WORD
    let guess = "";
    document.getElementById("answer").innerText = "";

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Not a valid word.";
        return;
    }

    //END OF VALID WORD CHECK

    let correct = 0;
    let letterCount = {};

    for (let i = 0; i < word.length; i++) {
        letter = word[i]
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        }
        else {
            letterCount[letter] = 1;
        }
    }

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        if (letter == "Å") {
            letter = "Z";
        }
        else if (letter == "CH") {
            letter = "C";
        }
        else if (letter == "Ñ") {
            letter = "J";
        }
        else if (letter == "NG") {
            letter = "V";
        }


        if (word[c] == letter) {
            currTile.classList.add("animate__flipInX");
            currTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
        }
    }

    /* SECOND CHECK */
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        if (letter == "Å") {
            letter = "Z";
        }
        else if (letter == "CH") {
            letter = "C";
        }
        else if (letter == "Ñ") {
            letter = "J";
        }
        else if (letter == "NG") {
            letter = "V";
        }

        if (!currTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("animate__flipInX");
                currTile.classList.add("present");
                letterCount[letter] -= 1;
            }
            else {
                currTile.classList.add("animate__flipInX");
                currTile.classList.add("absent");
            }

        }
    }
    row += 1;
    col = 0;
}
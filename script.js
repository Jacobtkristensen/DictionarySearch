"use strict"

let globalArrayOfWords = [];

async function loadDictionary() {
    const response = await fetch("data/ddo_fullforms_2023-10-11.csv");
    const rawtext = await response.text();

    globalArrayOfWords = rawtext.split("\n").map(line => {
        const parts = line.split("\t");
        return {
            variant: parts[0],
            headword: parts[1],
            homograph: parts[2],
            partofspeech: parts[3],
            id: parts[4],
        }
    });

    // console.log(globalArrayOfWords);
}

loadDictionary();

let searchWord = "hestevogn";
let dictionaryWord = {
    variant: "hestetyvs",
    headword: "hestetyv",
    homograph: undefined,
    partofspeech: "sb.",
    id: 53001170
}

function compare(searchWord, dictionaryWord) {
    if (searchWord < dictionaryWord.variant) {
        return -1;
    } else if (searchWord > dictionaryWord.variant) {
        return 1;
    } else {
        return 0;
    }
}

function binarySearch(array, searchWord, compare) {
    let start = 0;
    let end = array.length - 1;
    let middle;
    let totalIterations = 0;
    const maxIterations = Math.ceil(Math.log2(array.length));

    while (start <= end) {
        totalIterations++;
        middle = Math.floor((start + end) / 2);
        const compareResult = compare(searchWord, array[middle]);

        if (compareResult === 0) {
            // console.log("Total iterations: " + totalIterations);
            return middle;
        } else if (compareResult < 0) {
            end = middle - 1;
        }
        else {
            start = middle + 1;
        }
    }
    // console.log("Total iterations: " + totalIterations, "Max iterations: " + maxIterations);
    return -1; //not found
}

//kunne ikke få performance.mark & performance.measure til at virke, så bruger performance.now og gemmer dem i variabler
async function performanceCheck() {
    await loadDictionary();

    let startTime = performance.now();
    globalArrayOfWords.findIndex(word => word.variant === searchWord);
    let endTime = performance.now();
    let findIndexTime = endTime - startTime;
    console.log(`findIndex time: ${findIndexTime} milliseconds`);

    startTime = performance.now();
    binarySearch(globalArrayOfWords, searchWord, compare);
    endTime = performance.now();
    let binarySearchTime = endTime - startTime;
    console.log(`binarySearch tid: ${binarySearchTime} milliseconds`);

    console.log("forskel på findIndex og binarySearch: " + (findIndexTime - binarySearchTime) + "ms");
}

performanceCheck();


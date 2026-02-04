"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleCase = titleCase;
const abbreviations = ['NE', 'NW', 'SE', 'SW'];
// Assumes input is all caps
function titleCase(input) {
    const words = input.split(' ');
    const titleCasedWords = words.map((word) => {
        if (abbreviations.includes(word))
            return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return titleCasedWords.join(' ');
}

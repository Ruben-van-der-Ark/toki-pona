function approximateTranslation(text) {
    const words = text.split(/\s+/); // Split the input text into words
    const translations = [];
    let hasLi = words.includes('li');
    let hasO = words[0] === 'o'; // Check if the sentence starts with "o"
    let i = 0;

    // Handle the "o [verb] [*adjectives] (e [noun] [*adjectives])" pattern
    if (hasO && words.length > 1) {
        translations.push('go'); // Translate "o" as "Go"
        i++; // Skip the first word ("o")
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            if (word === 'e') {
                translations.push('e'); // Keep "e" untranslated
            } else if (words[i - 1] === 'e') {
                translation = translateWord(word, 'noun'); // The word after "e" is a noun
            } else if (i === 1) {
                translation = translateWord(word, 'verb'); // The word after "o" is a verb
            } else {
                translation = translateWord(word, 'adj'); // The rest are adjectives
            }

            translations.push(translation);
            i++;
        }
    }
    // Handle other patterns like "li" or general translation
    else if (hasLi) {
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            if (i === 0) {
                translation = translateWord(word, 'noun');  // First word is the subject (noun)
            } else if (words[i - 1] === 'li') {
                translation = translateWord(word, 'verb');  // The word following "li" is the verb
            } else if (word === 'e') {
                translation = 'e';  // e is a particle, don't translate
            } else if (words[i - 1] === 'e') {
                translation = translateWord(word, 'noun');  // After "e" comes the object noun
            } else {
                translation = translateWord(word, 'adj');  // Remaining words are adjectives
            }

            translations.push(translation);
            i++;
        }
    }
    // Fallback for other sentence structures
    else {
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            if (i === 0) {
                translation = translateWord(word, 'noun');
            } else {
                translation = translateWord(word, 'adj');
            }

            translations.push(translation);
            i++;
        }
    }

    return translations.join(' ');
}

// Helper function to translate a word with fallback to 'common' if the specified part of speech is not available
function translateWord(word, partOfSpeech) {
    // Handle the special syntax [_special_syntax]
    if (word.match(/\[_.*]/)) {
        return translateSpecialSyntax(word);
    }

    // Check for exact match
    if (tokiPonaDictionary[word]) {
        return tokiPonaDictionary[word][partOfSpeech] || tokiPonaDictionary[word]['common'];
    }

    // If exact match is not found, split on dash and treat first part as the original type, second as adjective
    if (word.includes('-')) {
        const [firstPart, secondPart] = word.split('-');

        let firstTranslation = translateWord(firstPart, partOfSpeech); // Retain original word type for first part
        let secondTranslation = translateWord(secondPart, 'adj'); // Treat second part as an adjective

        return `${firstTranslation} ${secondTranslation}`;
    }

    // If no match and no dash, return the word as is
    return word;
}

// Process the [_special_syntax] format by taking the first letter of each word inside the brackets
function translateSpecialSyntax(word) {
    const contents = word.slice(2, -1); // Remove the brackets [_ and ]
    const abbreviation = contents.split('_').map(word => word[0]).join('');
    return abbreviation.charAt(0).toUpperCase() + abbreviation.slice(1).toLowerCase(); // Capitalize result
}

function translateText() {
    // Get the value from the textarea and split using a regex that includes 'la', '?', '!', and '.'
    let inputText = document.getElementById('userInput').value.trim();

    if (!inputText || inputText.length === 0) {
        inputText = 'o toki-pona';  // Set to default text if empty
    }
    inputText = inputText.split(/( la |\?|!|\.)/);
    let translation = '';
    // Iterate over the inputText array and translate each part
    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i].trim()) {
            // Check if it's punctuation
            if (inputText[i].match(/^[?.!]$/)) {
                // If it's punctuation, append it with a space after
                translation += inputText[i] + ' ';
            }
            // Check if it's "la" to prefix and suffix with spaces
            else if (inputText[i] === ' la ') {
                translation += ' la ';
            }
            // Otherwise, translate the text
            else {
                translation += approximateTranslation(inputText[i].trim());
            }
        }
    }

    // Replace any newline characters with <br> for correct display, and trim extra spaces
    document.getElementById('translatedText').innerHTML =
        translation.replace(/\n/g, '<br>').trim();
}

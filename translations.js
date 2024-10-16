function approximateTranslation(text) {
    const words = text.split(/\s+/); // Split the input text into words
    const translations = [];
    let hasLi = words.includes('li');
    let hasO = words.includes('o');
    let firstWord = words[0];
    let i = 0;

    // First, we check for "li" or "o" sentence structures
    if (hasLi || hasO) {
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            // Handle the first noun and its adjectives before "li" or "o"
            if (i === 0) {
                translation = translateWord(word, 'noun');  // First word is the subject (noun)
            } else if (words[i - 1] === 'li' || words[i - 1] === 'o') {
                translation = translateWord(word, 'verb');  // The word following "li" or "o" is the verb
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
    // Handle "mi" or "sina" followed by a verb if there's no "li"
    else if ((firstWord === 'mi' || firstWord === 'sina') && !hasLi) {
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            if (i === 0) {
                translation = translateWord(word, 'noun');  // mi/sina treated as subject (noun)
            } else if (word === 'e') {
                translation = 'e';  // e is a particle, don't translate
            } else if (i === 1) {
                translation = translateWord(word, 'verb');  // The second word is the verb
            } else if (words[i - 1] === 'e') {
                translation = translateWord(word, 'noun');  // After "e" comes the object noun
            } else {
                translation = translateWord(word, 'adj');  // Remaining words are adjectives
            }

            translations.push(translation);
            i++;
        }
    }
    // Fallback: [noun] [*adjectives] structure
    else {
        while (i < words.length) {
            let word = words[i];
            let translation = '';

            // First word is a noun
            if (i === 0) {
                translation = translateWord(word, 'noun');
            }
            // Remaining words are adjectives
            else {
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
    let inputText = document.getElementById('userInput').value.trim();  // Get the value from the textarea
    if (!inputText) {
        inputText = 'o toki pona'
    }
      // Translate the text using the approximateTranslation function
    document.getElementById('translatedText').innerText = approximateTranslation(inputText);  // Update the #translatedText div with the translated text
}

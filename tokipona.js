const inputField = document.getElementById('userInput');
const linjaponaElement = document.querySelector('.linjapona h2');
const latinAlphabetElement = document.querySelector('.latinalphabet h2');

// Store default values for both sitelenpona elements
const defaultLinjaponaText = linjaponaElement.textContent.trim();  // Trim whitespace
const defaultLatinAlphabetText = latinAlphabetElement.textContent.trim();  // Trim whitespace

// Function to handle custom replacement in the second h2
function processSpecialSyntax(text) {
    // Match the pattern like [lipu_insa_nena_jelo_a_pona_o_nasin_ale]
    const regex = /\[(.*?)\]/g;
    return text.replace(regex, (match, contents) => {
        // Extract first letter of each word and capitalize the first letter of the resulting string
        const abbreviation = contents.split('_').map(word => word[0]).join('');
        return abbreviation.charAt(0).toUpperCase() + abbreviation.slice(1).toLowerCase();
    });
}

// Event listener to update h2 content based on textarea input
inputField.addEventListener('input', function() {
    let newValue = inputField.value.trim();  // Trim any leading/trailing whitespace
    newValue = newValue.toLowerCase();
    // Handle line breaks and default values for the linjapona element
    if (newValue === '') {
        linjaponaElement.innerHTML = defaultLinjaponaText.replace(/\n/g, '<br>');  // No extra new lines
    } else {
        linjaponaElement.innerHTML = newValue.replace(/\n/g, '<br>');
    }

    // Handle special syntax, line breaks, and default values for the latin-alphabet element
    if (newValue === '') {
        latinAlphabetElement.innerHTML = defaultLatinAlphabetText.replace(/\n/g, '<br>');  // No extra new lines
    } else {
        // Apply custom syntax transformation for the latin-alphabet h2
        let processedValue = newValue.replace(/-/g, ' ');  // Remove dashes
        processedValue = processSpecialSyntax(processedValue);  // Replace custom syntax
        latinAlphabetElement.innerHTML = processedValue.replace(/\n/g, '<br>');  // Add line breaks
    }
});

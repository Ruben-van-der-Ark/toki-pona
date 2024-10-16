const inputField = document.getElementById('userInput');
const linjaponaElement = document.querySelector('.linjapona h4');
const latinAlphabetElement = document.querySelector('.latinalphabet h4');

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
    newValue = newValue.toLowerCase();  // Convert to lowercase

    // Handle linjapona element (with line breaks) as user input
    if (newValue === '') {
        linjaponaElement.innerHTML = defaultLinjaponaText.replace(/\n/g, '<br>');  // Reset to default with breaks
    } else {
        linjaponaElement.innerHTML = newValue.replace(/\n/g, '<br>');  // Replace explicit line breaks with <br>
    }

    // Handle special syntax for latin alphabet element (without breaking words inappropriately)
    if (newValue === '') {
        latinAlphabetElement.innerHTML = defaultLatinAlphabetText.replace(/\n/g, '<br>');  // Reset to default text
    } else {
        let processedValue = newValue.replace(/-/g, ' ');  // Replace dashes with spaces for Latin alphabet
        processedValue = processSpecialSyntax(processedValue);  // Apply special syntax transformation
        latinAlphabetElement.innerHTML = processedValue;  // No need for <br>, allow natural line wrapping
    }
});

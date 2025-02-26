

// Function to hide the loading overlay
function hideLoadingOverlay() {
    let overlay = document.querySelector('#loading');
    overlay.style.display = 'none';
}

// Event listener for when the page has finished loading
window.addEventListener('load', function () {
    // Hide the loading overlay
    hideLoadingOverlay();
});

    

// Function to update the loading text and scale effect
function updateLoadingText() {

    var loadingText = document.getElementById('loadingText');
    var currentText = loadingText.innerText;
    var newText = 'digiProd';

    // Check if the text already ends with ".."
    if (currentText === 'digiProd') {
        newText = 'Loading';
        loadingText.style.animation = 'scale-in-out 1s ease-in-out infinite alternate';
        
    } else {
        newText = 'digiProd';
        loadingText.style.animation = 'none';
    }

    loadingText.innerText = newText;
}

// Call the function to update the loading text every 4 seconds (4000 milliseconds)
setInterval(updateLoadingText, 4000);





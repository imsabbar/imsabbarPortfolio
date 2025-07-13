
let experienceValues = document.querySelectorAll('.experience .tab .expValue');
let interval = 5000;

experienceValues.forEach((experienceValues) => {

    let startValue = 0;
    let endValue = parseInt(experienceValues.getAttribute("data-val"));

    let duration = Math.floor(interval / endValue);

    let counter = setInterval(function () {
        startValue +=1 ; 
        experienceValues.textContent = startValue;

        if(startValue == endValue)
            clearInterval(counter); 
    }, duration);
}); 

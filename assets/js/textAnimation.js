
// text animation for Greeting
const myGreetingElement = document.querySelector('.greeting');
const myGreetingText = myGreetingElement.textContent;
const greetingSplitText = myGreetingText.split("");

// get Name, Field and Tagline
const myNameElement = document.querySelector('.name');

const myFieldElement = document.querySelector('.title');
const myFieldText = myFieldElement.textContent;
const fieldSplitText = myFieldText.split("");

const myQuoteElement = document.querySelector('.tagline');
const myQuoteText = myQuoteElement.textContent;
const quoteSplitText = myQuoteText.split("");


myGreetingElement.textContent = "";
myFieldElement.textContent = "";
myQuoteElement.textContent = "";




for(let i=0 ; i < greetingSplitText.length ; i++) 
  myGreetingElement.innerHTML += "<span class='animate'>" +greetingSplitText[i]+ "</span>";



for(let i=0 ; i < fieldSplitText.length ; i++) 
  myFieldElement.innerHTML += "<span class='animate'>" +fieldSplitText[i]+ "</span>";



for(let i=0 ; i < quoteSplitText.length ; i++) 
  myQuoteElement.innerHTML += "<span class='animate'>" +quoteSplitText[i]+ "</span>";



let charGreeting = 0, charField = 0, charQuote = 0;
let timer = setInterval(onTick, 50);




function onTick() {
  const spanGreeting = myGreetingElement.querySelectorAll('span')[charGreeting];
  const spanField = myFieldElement.querySelectorAll('span')[charField];
  const spanQuote = myQuoteElement.querySelectorAll('span')[charQuote];


  if (spanGreeting) {
    spanGreeting.classList.add('fade');
    charGreeting+=1;
  }


  if (spanField) {
    spanField.classList.add('fade');
    charField++;
  }
   
 

  // Name animation starts only after field is complete
  if (charField === fieldSplitText.length) {
    if (myNameElement) {
      myNameElement.style.opacity = '1';
      myNameElement.style.transform = 'translateX(0)';
    }
  }



 
  if (spanQuote) {
    spanQuote.classList.add('fade');
    charQuote++;

  }


  if (charGreeting === greetingSplitText.length && charField === fieldSplitText.length && charQuote === quoteSplitText.length) {
    complete();
    return;
  }

}


function complete() {
  clearInterval(timer);
  timer = null;
}





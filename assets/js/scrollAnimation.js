// this is for scrolling
let calcScrollValue = () => {

    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    let scrollValue = Math.round((pos * 100) / calcHeight);  

    if (pos > 100) {
      scrollProgress.style.display = "grid";

    } else {
      scrollProgress.style.display = "none";
    }  

    scrollProgress.addEventListener("click", () => {
      document.documentElement.scrollTop = 0;
    });  
    scrollProgress.style.background = `conic-gradient(#47b69e ${scrollValue}%, #e7e7e7 ${scrollValue}%)` ;
};    
  




// disapear Scroll Icon when scrolling
const scrollDownDiv = document.querySelector('.scroll-down');

function handleScroll() {
  if (window.scrollY > 150) 
    scrollDownDiv.classList.add('isHidden');

  else 
    scrollDownDiv.classList.remove('isHidden');
  
}

window.addEventListener('scroll', handleScroll);

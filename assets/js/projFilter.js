// for Projects filter
$(document).ready(function() {
    $(".filter-item").click(function() {
      const value = $(this).attr("data-filter");
  
      if (value == "all") {
        $(".project-box").removeClass("hide").addClass("show");
      } else {
        $(".project-box").removeClass("show").addClass("hide");
        $(".project-box." + value).removeClass("hide").addClass("show");
      }
    });
  
    
    // add active btn 
    $(".filter-item").click(function() {
      $(this).addClass("active-filter").siblings().removeClass("active-filter")
    })
  
  })
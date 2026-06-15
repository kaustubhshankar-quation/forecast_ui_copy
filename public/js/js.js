/* ========================================== 
Section 3 
  ========================================== */
  $(window).load(function () {
    $(".flexslider").flexslider({
      animation: "slide",
      animationLoop: true,
      itemWidth: 300,
      itemMargin: 20,
      minItems: 1,
      maxItems: 2,
    });
  });


/* ========================================== 
Menu Scroll
========================================== */
$(document).ready(function () {
  $(".scroll").click(function (event) {
      $('html,body').animate({ scrollTop: $(this.hash).offset().top }, 800);
  });
});

/* ==========================================
Footer Top Scroll
========================================== */
function scrollToBottom() {
  $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
}
function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 'slow');
}

/* ==========================================
Fixed Header
========================================== */
$(window).on("scroll", function () {
  if ($(window).scrollTop() > 50) {
      $(".newheader").addClass("active");
  } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".newheader").removeClass("active");
  }
});

/* ==========================================
After Login Fixed Header
========================================== */
$(window).on("scroll", function () {
  if ($(window).scrollTop() > 50) {
      $(".afterloginnewheader").addClass("active");
  } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".afterloginnewheader").removeClass("active");
  }
});
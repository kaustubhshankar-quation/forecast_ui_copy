$(function () {
    var $owl = $('.owl-carousel'),
        effect = getAnimationName(),
        outIndex,
        isDragged = false;
  
    $owl.owlCarousel({
      margin: 0,
      navSpeed: 500,
      nav: true,
        items: 1,
        autoplay: true,
        loop: true,
      animateIn: 'fake',
      animateOut: 'fake'
    });
  
    $owl.on('change.owl.carousel', function(event) {
      outIndex = event.item.index;
    });
  
    $owl.on('changed.owl.carousel', function(event) {
      var inIndex = event.item.index,
          dir = outIndex <= inIndex ? 'Next' : 'Prev';
  
      var animation = {
        moveIn: {
          item: $('.owl-item', $owl).eq(inIndex),
          effect: effect + 'In' + dir
        },
        moveOut: {
          item: $('.owl-item', $owl).eq(outIndex),
          effect: effect + 'Out' + dir
        },
        run: function (type) {
          var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
              animationObj = this[type],
              inOut = type == 'moveIn' ? 'in' : 'out',
              animationClass = 'animated owl-animated-' + inOut + ' ' + animationObj.effect,
              $nav = $owl.find('.owl-prev, .owl-next, .owl-dot, .owl-stage');
  
          $nav.css('pointerEvents', 'none');
  
          animationObj.item.stop().addClass(animationClass).one(animationEndEvent, function () {
            // remove class at the end of the animations
            animationObj.item.removeClass(animationClass);
            $nav.css('pointerEvents', 'auto');
          });
        }
      };
  
      if (!isDragged){
        animation.run('moveOut');
        animation.run('moveIn');
      }
    });
  
    $owl.on('drag.owl.carousel', function(event) {
      isDragged = true;
    });
  
    $owl.on('dragged.owl.carousel', function(event) {
      isDragged = false;
    });
  
    /**
     * Get Animation Name from the class 'owl-carousel',
     * animation name begins with fx...
     */
    function getAnimationName(){
      var re = /fx[a-zA-Z0-9\-_]+/i,
          matches = re.exec($owl.attr('class'));
  
      return matches !== null ? matches[0] : matches;
    }
  
  
    /**
     * For Demo (Selectbox)
     * Change select options with animation name
     */
    $('#fxselect').on('change', function (e) {
      var $owlCarousel = $('.owl-carousel'),
          animationName = getAnimationName();
      effect = $(this).find('option:selected').val();
  
      //remove old root class
      if (animationName !== null){
        $owl.removeClass(animationName);
      }
  
      //add new root class
      $owlCarousel.addClass(effect);
    });
  });
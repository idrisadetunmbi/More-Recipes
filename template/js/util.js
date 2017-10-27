(function($){
  $(function(){
    $('.button-collapse').sideNav();
    var $container = $('#recipe-gallery');
  
    $container.masonry({
      columnWidth: '.recipe',
      itemSelector: '.recipe',
      percentPosition: true
    });

    $('.modal').modal();

    $('.btn-browse-catalog').on('click', function () {
      $('html, body').animate({
        scrollTop: $("#recipe-gallery").offset().top-90
      }, 500);
    });

    $('#about-btn').on('click', function () {
      $('html, body').animate({
        scrollTop: $("#about-section").offset().top
      }, 500);
    });

    let text = 'Browse through a rich base of interesting and exciting recipes from lovers of new tastes like you';
    $('.recipe').find('p').text(text);

    let cardAaction = '<div><span><i class="material-icons">thumb_up</i>5</span><span><i class="material-icons">thumb_down</i>10</span><span><i class="material-icons">star</i>50</span></div>';
    $('.recipe').find('.card-action').empty();
    $('.recipe').find('.card-action').append(cardAaction);
  }); // end of document ready
})(jQuery); // end of jQuery name space
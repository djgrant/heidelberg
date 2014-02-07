new Heidelberg($('.Heidelberg-Book'), {
  previousButton: $('#previous'),
  nextButton: $('#next')
});

$(window).load(function() {
  $('html').removeClass('preload');
});

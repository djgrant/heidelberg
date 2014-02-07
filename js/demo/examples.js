new OpusFlux($('.OpusFlux-Book'), {
  previousButton: $('#previous'),
  nextButton: $('#next')
});

$(window).load(function() {
  $('html').removeClass('preload');
});

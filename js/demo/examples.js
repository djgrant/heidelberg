new Heidelberg($('#Heidelberg-example-1'), {
  previousButton: $('#previous'),
  nextButton: $('#next'),
});

new Heidelberg($('#Heidelberg-example-2'), {
  canClose: true
});

$(window).load(function() {
  $('html').removeClass('preload');
});

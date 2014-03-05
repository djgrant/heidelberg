var book1 = new Heidelberg($('#Heidelberg-example-1'), {
  previousButton: $('#previous'),
  nextButton: $('#next'),
  hasSpreads: true,
  onPageTurn: function(el, els) {
    console.log('Page turned');
  },
  onSpreadSetup: function(el) {
    console.log('Spread setup');
  }
});

$('#jump').on('click', function() {
  book1.turnPage(9);
});

new Heidelberg($('#Heidelberg-example-2'), {
  canClose: true,
  arrowKeys: false,
  concurrentAnimations: 5
});
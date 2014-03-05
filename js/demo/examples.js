new Heidelberg($('#Heidelberg-example-1'), {
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

new Heidelberg($('#Heidelberg-example-2'), {
  canClose: true,
  arrowKeys: false,
  concurrentAnimations: 5
});

var progressIndicators = function(page, el){
  var indicators = el.parents('.book-module').find('.book-module-indicator');
  indicators.removeClass('filled');
  indicators.slice(0, page).addClass('filled');
};

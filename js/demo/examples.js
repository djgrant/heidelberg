new Heidelberg($('#Heidelberg-example-1'), {
  previousButton: $('#previous'),
  nextButton: $('#next'),
  onPageTurn: function(el, els) {
    debugger;
  }
});

new Heidelberg($('#Heidelberg-example-2'), {
  canClose: true,
  arrowKeys: false,
  concurrentAnimations: 5
});

(function() {

  function OpusFlux(el, options) {

    // INSTANTIATION
    // Allow developer to omit new when instantiating
    if (!(this instanceof OpusFlux)) {
      if (el.length) {
        Array.prototype.forEach.call(el, function(n) {
          return new OpusFlux(el, options);
        });
      } else {
        return new OpusFlux(el, options);
      }
    }

    if (this === window) {
      return;
    }

    // OPTIONS
    var defaults = {
      nextButton: $(),
      previousButton: $()
    };

    var userOptions = options || {};

    this.options    = {};

    for (var x in defaults) {
      this.options[x] = userOptions[x] || defaults[x];
    }

    // PRIVATE VARIABLES
    // Main element always a jQuery object
    this.el = (el instanceof jQuery) ? el : $(el);

    // RUN
    this.init();

  };

  OpusFlux.prototype.init = function() {

    var el   = this.el;

    var els = {
      pagesLeft: $('.OpusFlux-Page:nth-child(2n)', el),
      pagesRight: $('.OpusFlux-Page:nth-child(2n+1)', el)
    };

    els.previousTrigger = els.pagesLeft.add(this.options.previousButton);
    els.nextTrigger = els.pagesRight.add(this.options.nextButton);

    els.previousTrigger.on('click', function() {
      this.turnPage('back');
    }.bind(this));

    els.nextTrigger.on('click', function() {
      this.turnPage('forwards');
    }.bind(this));

  };

  OpusFlux.prototype.turnPage = function(direction) {

    var el = this.el;
    var els = {};

    if(($('.OpusFlux-Page').last().hasClass('is-active') && direction == 'forwards')
      || ($('.OpusFlux-Page').first().hasClass('is-active') && direction == 'back')
      || $('.OpusFlux-Page.is-animating').length > 3) {
      return
    }

    els.isActive       = $('.OpusFlux-Page.is-active', el);
    els.isAnimatingOut = (direction == 'back') ? $('.OpusFlux-Page.is-active').first() : $('.OpusFlux-Page.is-active').last();

    $('.OpusFlux-Page.was-active', el).removeClass('was-active');

    if (direction == 'back') {
      els.isAnimatingIn = els.isAnimatingOut.prev();
      els.newActive     = els.isAnimatingIn.add(els.isAnimatingIn.prev());
    }

    if (direction == 'forwards') {
      els.isAnimatingIn = els.isAnimatingOut.next();
      els.newActive     = els.isAnimatingIn.add(els.isAnimatingIn.next());
    }

    els.isActive.removeClass('is-active').addClass('was-active');
    els.newActive.addClass('is-active');

    els.isAnimating = els.isAnimatingIn.add(els.isAnimatingOut);

    els.isAnimating.addClass('is-animating');
    els.isAnimating.on('webkittransitionEnd otransitionend mstransitionEnd transitionend', function () {
        els.isAnimating.removeClass('is-animating');
    }.bind(document));

  };

  // expose OpusFlux
  window.OpusFlux = OpusFlux;

})();

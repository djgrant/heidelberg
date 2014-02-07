(function() {

  function Heidelberg(el, options) {

    // INSTANTIATION
    // Allow developer to omit new when instantiating
    if (!(this instanceof Heidelberg)) {
      if (el.length) {
        Array.prototype.forEach.call(el, function(n) {
          return new Heidelberg(el, options);
        });
      } else {
        return new Heidelberg(el, options);
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

  Heidelberg.prototype.init = function() {

    var el   = this.el;

    var els = {
      pagesLeft: $('.Heidelberg-Page:nth-child(2n)', el),
      pagesRight: $('.Heidelberg-Page:nth-child(2n+1)', el)
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

  Heidelberg.prototype.turnPage = function(direction) {

    var el = this.el;
    var els = {};

    if(($('.Heidelberg-Page').last().hasClass('is-active') && direction == 'forwards')
      || ($('.Heidelberg-Page').first().hasClass('is-active') && direction == 'back')
      || $('.Heidelberg-Page.is-animating').length > 3) {
      return
    }

    els.isActive       = $('.Heidelberg-Page.is-active', el);
    els.isAnimatingOut = (direction == 'back') ? $('.Heidelberg-Page.is-active').first() : $('.Heidelberg-Page.is-active').last();

    $('.Heidelberg-Page.was-active', el).removeClass('was-active');

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

  // expose Heidelberg
  window.Heidelberg = Heidelberg;

})();

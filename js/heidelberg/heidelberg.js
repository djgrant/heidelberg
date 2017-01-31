/* global Hammer */

(function(factory) {
  // expose Heidelberg
  if (typeof module === 'object' && module.exports) {
    require('browsernizr/test/css/transformstylepreserve3d');
    require('browsernizr/test/css/transforms3d');

    module.exports = factory(require('jquery'), require('browsernizr'));
  } else {
    // Check for Modernizr, if not available assume modern browser
    var Modernizr = window.Modernizr || { csstransforms3d: true };
    if (typeof Modernizr.preserve3d !== 'boolean') {
      Modernizr.preserve3d = true;
    }

    window.Heidelberg = factory(window.jQuery, Modernizr);
  }
})(function ($, Modernizr) {
  'use strict';

  function Heidelberg(el, options) {

    // Allow developer to omit new when instantiating
    if (!(this instanceof Heidelberg)) {
      if (el.length) {
        Array.prototype.forEach.call(el, function(n) {
          return new Heidelberg(n, options);
        });
      } else {
        return new Heidelberg(el, options);
      }
    }

    // OPTIONS
    var defaults = {
      nextButton: $(),
      previousButton: $(),
      hasSpreads: false,
      canClose: false,
      arrowKeys: true,
      concurrentAnimations: null,
      limitPageTurns: true,
      initialActivePage: 0,
      onPageTurn: function() {},
      onSpreadSetup: function() {}
    };

    this.options = $.extend({}, defaults, options);

    // PRIVATE VARIABLES
    // Main element always a jQuery object
    this.el = (el instanceof $) ? el : $(el);
    this.el.attr('data-useragent', navigator.userAgent); // Add user agent attribute to HTMLElement - used in CSS selection ( for IE10 detection )
    // RUN
    this.init();

  }

  Heidelberg.prototype.init = function() {

    var el      = this.el;
    var els     = {};
    var options = this.options;

    setTimeout(function() {
      el.addClass('is-ready');
    }, 0);

    if(options.hasSpreads) {
      this.setupSpreads();
    }

    var leftFunction  = options.canClose ? 'even' : 'odd';
    var rightFunction = options.canClose ? 'odd' : 'even';

    els.pages      = $('.Heidelberg-Page', this.el);
    els.pagesLeft  = $('.Heidelberg-Page:nth-child('+leftFunction+')', el);
    els.pagesRight = $('.Heidelberg-Page:nth-child('+rightFunction+')', el);

    // if initialActivePage is odd, we substract one.
    var initialActivePage = options.initialActivePage & 1
      ? options.initialActivePage - 1
      : options.initialActivePage;

    if(!options.canClose) {
      var coverEl = $('<div />').addClass('Heidelberg-HiddenCover');
      el.prepend(coverEl.clone());
      el.append(coverEl.clone());

      els.pages.eq(initialActivePage).add(
        els.pages.eq(initialActivePage + 1)).addClass('is-active');
    }
    else {
      if (options.initialActivePage !== 0) {
        els.pages.eq(initialActivePage).add(
          els.pages.eq(initialActivePage + 1)).addClass('is-active');
      } else {
        els.pages.eq(0).addClass('is-active');
      }
    }

    els.previousTrigger = els.pagesLeft.add(options.previousButton);
    els.nextTrigger     = els.pagesRight.add(options.nextButton);

    els.previousTrigger.on('click', function() {
      this.turnPage('back');
    }.bind(this));

    els.nextTrigger.on('click', function() {
      this.turnPage('forwards');
    }.bind(this));

    if(typeof Hammer !== 'undefined') {
      var opts = {
        drag_min_distance: 5,
        swipe_velocity: 0.3
      };

      Hammer(els.pagesLeft, opts).on("dragright", function(evt) {
        this.turnPage('back');
        evt.gesture.stopDetect();
      }.bind(this));

      Hammer(els.pagesRight, opts).on("dragleft", function(evt) {
        this.turnPage('forwards');
        evt.gesture.stopDetect();
      }.bind(this));
    }

    var forwardsKeycode = 37;
    var backKeycode = 39;

    if((!Modernizr.csstransforms3d)) {
      forwardsKeycode = 39;
      backKeycode = 37;
    }

    if(options.arrowKeys) {
      $(document).keydown(function(e){
        if (e.keyCode == forwardsKeycode) {
          this.turnPage('forwards');
          return false;
        }
        if (e.keyCode == backKeycode) {
          this.turnPage('back');
          return false;
        }
      }.bind(this));
    }
  };

  Heidelberg.prototype.turnPage = function(arg) {

    var el        = this.el;
    var els       = {};
    var options   = this.options;
    var index     = {};
    var direction = arg;

    els.pages          = $('.Heidelberg-Page', el);
    els.pagesActive    = $('.Heidelberg-Page.is-active', el);
    els.pagesAnimating = $('.Heidelberg-Page.is-animating', el);
    els.children       = $('.Heidelberg-Page, .Heidelberg-HiddenCover', el);

    var maxAnimations = options.concurrentAnimations && els.pagesAnimating.length > options.concurrentAnimations;
    var maxAnimationsBrowser = !Modernizr.preserve3d && els.pagesAnimating.length > 2 && options.limitPageTurns;

    if(maxAnimations || maxAnimationsBrowser) {
      return;
    }

    if ( options.hasSpreads ) {
      index.activeRight = els.pagesActive.eq(1).index();
      index.activeLeft  = index.activeRight - 1;
    } else {// Single page spreads
      index.activeLeft  = els.pagesActive.eq(0).index(); // Note about fix: the double spread code above caused code to wrap to bottom of array . This is the fix for double spreads.
      index.activeRight = index.activeLeft + 1;
    }

    var isFirstPage = els.pages.first().index() == index.activeLeft && direction == 'back';
    var isLastPage  = els.pages.last().index() == index.activeRight && direction == 'forwards';

    if(isFirstPage || isLastPage) {
      return;
    }

    if(typeof arg == 'number') {
      var isOdd         = arg & 1;
      var isRight       = options.canClose ? isOdd : !isOdd;

      index.targetRight = isRight ? arg : arg + 1;
      index.targetLeft  = index.targetRight - 1;

      if (index.targetLeft == index.activeLeft) {
        return;
      }
      else if(index.targetLeft > index.activeRight) {
        direction           = 'forwards';
        index.target        = index.targetLeft;
        index.targetSibling = index.target + 1;
      }
      else {
        direction           = 'back';
        index.target        = index.targetRight;
        index.targetSibling = index.target - 1;
      }

      if ( ! options.hasSpreads )
      {
        index.target = index.target - 1;
        index.targetSibling = index.targetSibling - 1;
      }

    }
    else {
      index.target        = direction == 'forwards' ? index.activeRight + 1 : index.activeLeft - 1;
      index.targetSibling = direction == 'forwards' ? index.activeRight + 2 : index.activeLeft - 2;
    }

    if ( ! options.hasSpreads && direction == 'forwards' && index.target == 2 ) {
      index.target = 1;
      index.targetSibling = 2;
    }

    els.pagesAnimatingOut = (direction == 'back') ? els.pagesActive.first() : els.pagesActive.last();
    els.pagesAnimatingIn  = els.children.eq(index.target);
    els.pagesTarget       = els.pagesAnimatingIn.add(els.children.eq(index.targetSibling));
    els.pagesAnimating    = els.pagesAnimatingIn.add(els.pagesAnimatingOut);

    els.pagesActive.removeClass('is-active').addClass('was-active');
    els.pagesTarget.addClass('is-active');

    if((Modernizr.csstransforms3d)) {
      els.pagesAnimating.addClass('is-animating');
    }

    els.pagesAnimating.on('webkitTransitionEnd oTransitionEnd msTransitionEnd transitionend', function () {
      els.pagesAnimating.removeClass('is-animating');
      els.pagesActive.removeClass('was-active');
    }.bind(document));

    options.onPageTurn(el, els);
    $(this).trigger('pageTurn.heidelberg', [el, els]);

  };

  Heidelberg.prototype.setupSpreads = function() {

    var el      = this.el;
    var options = this.options;

    $('.Heidelberg-Spread', el).each(function() {
      var spreadEl = $(this);
      var pageEl   = $('<div />').addClass('Heidelberg-Page with-Spread').html(spreadEl.clone());
      spreadEl.after(pageEl);
      spreadEl.replaceWith(pageEl.clone());
    });

    options.onSpreadSetup(el);
    $(this).trigger('spreadSetup.heidelberg', el);
  };
  return Heidelberg;
});

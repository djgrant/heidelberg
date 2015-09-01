import $ from 'jquery';
import TweenLite from 'gsap/src/uncompressed/TweenLite';
import 'gsap/src/uncompressed/plugins/CSSPlugin';

const
    forwardsKeycode = 37,
    backKeycode = 39,
    defaults = {
        nextButton: $(),
        previousButton: $(),
        hasSpreads: false,
        canClose: false,
        arrowKeys: true,
        concurrentAnimations: null,
        onPageTurn: function() {},
        onSpreadSetup: function() {}
    };

function Heidelberg(options) {
  this.options = $.extend({}, defaults, options);
};

Heidelberg.prototype = {
    turnForward: function() {
        TweenLite.to(nextPage, 0.5, { transformX: 0 });
    },
    turnBack: function() {
        TweenLite.to(nextPage, 0.5, { transformX: 0 });
    }
};

export default Heidelberg;

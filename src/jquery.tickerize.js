(function ($) {
  $.fn.tickerize = function (options) {
    var defaults = {
      delay: 5000,
      tick: '.tick',
      speed: 400
    };
    
    options = $.extend({}, options, defaults);
    return this.each(
      function () {
        var $this = $(this);
        if (!$this.data('tickerize')) {
          $this.data('tickerize', new $.fn.tickerize.instance(this, options)._init(arguments));
        }
      }).data('tickerize');
  };
  
  $.extend($.fn.tickerize, {
    instance: function (element, options) {
      this.element = $(element);
      this.tickerList = $('.tickers', this.element);
      this.options = options;
      this.active = $(this.options.tick + ':first', this.tickerList);
      this.ticks = $(this.options.tick, this.tickerList);
    }
  });
  
  $.extend($.fn.tickerize.instance.prototype, {
    _init: function () {
      this.element.bind({
        'animate.tickerize': $.proxy(this._animate, this),
        'pause.tickerize': $.proxy(this._pause, this),
        'start.tickerize': $.proxy(this._setTimeout, this)
      }).find(this.options.tick).hover(function () {
        $(this).trigger('pause');
      },
                                       function () {
                                         $(this).trigger('start');
                                       }
                                      );
      
      this.timer = null;
      this.total = this.ticks.length;
      
      this._setUp();
      this._setTimeout();
    },
    _animate: function () {
      var self = this,
          active = this.active,
          next = active.next(this.options.tick);
      
      if (active.index() == (this.total - 1)) {
        next = this.ticks.eq(0);
      }
      
      active.stop(true, false).fadeOut(this.options.speed, function () {
        next.fadeIn(self.options.speed);
        self.active = next;
        self._setTimeout();
      });
    },
    _pause: function () {
      window.clearTimeout(this.timer);
    },
    _setUp: function () {
      var zIndex = 100;
      this.ticks.each(function () {
        $(this).css({
          'display': 'none',
          'z-index': zIndex
        });
        zIndex--;
          });
        this.ticks.eq(0).show();
        return this;
      },
                      _setTimeout: function () {
        window.clearTimeout(this.timer);
      this.timer = window.setTimeout($.proxy(this._animate, this), this.options.delay);
    }
  });
}(jQuery));

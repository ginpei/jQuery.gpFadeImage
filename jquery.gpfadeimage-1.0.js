/**
 * jQuery.gpFadeImage 1.0
 * http://ginpen.com/jquery/gpfadeimage/
 * https://github.com/ginpei/jQuery.gpFadeImage
 *
 * Copyright (c) 2012 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpFadeImage) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpFadeImage = com.ginpen.gpFadeImage = {
        /**
         * The version of this application.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Default settings.
         * @type Object
         */
        settings: {
          duration: 1000,
          interval: 2000
        },

        /**
         * Init target
         * @param {HtmlElement} $el The target.
         * @param {Object} settings
         */
        exec: function($el, settings) {
          this._setSettings($el, settings);

          if (this._isAvailable($el)) {
            this._normalizeSetting($el);
            this._wrap($el);
            this._kick($el);
          }
        },

        /**
         * Bind settings with the target element.
         */
        _setSettings: function($el, settings) {
          $el.data('gpFadeImage.settings', settings || {});
          return this;
        },

        /**
         * Get settings from the target element.
         */
        getSettings: function($el) {
          return $el.data('gpFadeImage.settings');
        },

        /**
         * Return true if available.
         */
        _isAvailable: function($el) {
          if (!$el.is('img')) {
            return false;
          }
          else if (!$el.attr('src')) {
            return false;
          }
          else {
            var settings = this.getSettings($el);
            if ('length' in settings) {
              if (settings.length < 1) {
                return false;
              }
            }
            else {
              if (!settings.src) {
                return false;
              }
              else if (settings.src.length < 1) {
                return false;
              }
            }
          }

          return true;
        },

        /**
         * Normalize settings.
         */
        _normalizeSetting: function($el) {
          var settings = this.getSettings($el);

          if ('length' in settings) {
            settings = {
              src: settings
            }
          }

          settings = $.extend({}, this.settings, settings);

          settings.duration = Math.max(1, settings.duration);
          settings.interval = Math.max(1, settings.interval);

          var srcList = settings.src;
          srcList.unshift($el.attr('src'));

          var srcSolidList = [];
          for (var i = 0, l = srcList.length; i < l; i++) {
            var item = srcList[i];
            if (item) {
              srcSolidList.push(item);
            }
          }
          settings.src = srcSolidList;

          this._setSettings($el, settings);

          return this;
        },

        /**
         * Wrap element to fade.
         */
        _wrap: function($el) {
          $el.wrap('<span />').parent()
            .addClass('gpfadeimage-wrapper')
            .css({
              display: 'inline-block',
              height: $el.height(),
              width: $el.width()
            });
        },

        /**
         * Kick fading timer.
         */
        _kick: function($el) {
          var settings = this.getSettings($el);

          this._setNextImage($el);

          var that = this;
          setTimeout(function() {
            that._next($el, function() {
              that._kick($el);
            });
          }, settings.interval);
        },

        _next: function($el, callback) {
          var settings = this.getSettings($el);

          var that = this;
          $el.fadeTo(settings.duration, 0, function() {
            $el
              .attr('src', $el.data('gpfadeimage.nextSrc'))
              .css('opacity', 1);
            callback();
          });
        },

        _setNextImage: function($el) {
          var settings = this.getSettings($el);
          var index = $el.data('gpfadeimage.index') || 0;
          var srcList = settings.src;
          var nextSrc = srcList[++index % srcList.length];
          $el.parent().css('background-image', 'url("' + nextSrc + '")');
          $el
            .data('gpfadeimage.index', index)
            .data('gpfadeimage.nextSrc', nextSrc);
        },

        banpei: null
    };

    // jQuery method interface
    $.fn.gpFadeImage = function(listener, param) {
        return this.each(function(i, el) {
            gpFadeImage.exec($(el), listener, param);
        });
    };
}(jQuery));

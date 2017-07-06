/* ============================================
findactiveaddblock - detect one element is shown in viewport

properties
    delay
events
    onGetDomElement         
        input - object (in children array)
    onActive
        input - {$el, object (in children array)}
    onInActive
        input - {$el, object (in children array)}
methods
    destroy()       // destroy plugin

ie

$(".wrapper").findactiveaddblock({
    delay: 1000,
    children: $('.block'),        
    onGetDomElement: function(obj) {
        return obj;  
    },   
    onActive: function(oParam) {
        oParam.$el.css({border: "5px solid red"});
    },
    onInActive: function(oParam) {
        oParam.$el.css({border: 'none'});
    }
});   

$(".wrapper").data("findactiveaddblock").destroy();
===============================================*/
define("findactiveaddblock", ["jquery", "underscore"], function (JQuery, _) {
	;( function( $, window, document, undefined ) {
		"use strict";

		// Create the defaults once
		var pluginName = "findactiveaddblock",
			defaults = {
				delay: 200,
				scrollableParent: window,
				checkOnStart: false,
				children: null,
				onScrollEnd: null
			};

		// The actual plugin constructor
		function Plugin(element, options) {
			this.element = element;
			this.$element = $(element);
			this.settings = $.extend({}, defaults, options);
			this._defaults = defaults;
			this._name = pluginName;
			this.$scollableParent = undefined;
			this.$previousItem = undefined;
			this.init();
		}

		///////////////////////////////////////////
		// Edit plugin here

		$.extend(Plugin.prototype, {
			init: function () {
				var me = this;

				me.$scrollableParent = $(me.settings.scrollableParent);

				// checkViewport is checkOnStart is true
				if (me.settings.checkOnStart) {
					me.checkViewport();
				}				
				me.detectScroll();
			},
			destroy: function () {
				var me = this;

				// call inActive event
				me.callInactive();

				// unbind scroll event 
				me.$scrollableParent.off("scroll.findactiveaddblock");
				// remove data so it can be enable after destroy
				me.$element.removeData(me._name);
			},
			detectScroll: function () {
				var me = this,
				timer;

				me.$scrollableParent.on("scroll.findactiveaddblock", function (event) {
					clearTimeout(timer);
					timer = setTimeout(function () {
						me.checkViewport();
					}, me.settings.delay);
				});
			},
			checkViewport: function () {
				var me = this,
					$children = me.settings.children,
					results = [];

				_.each($children, function (val, key) {
					var $this;

					if ($.isFunction(me.settings.onGetDomElement)) {
						var domElement = me.settings.onGetDomElement.call(me, val);
						$this = $(domElement);
					}
					else {
						$this = $(val);
					}

					if (isInViewport($this, me.$scrollableParent)) {
						results.push({ $el: $this, obj: val });
					}
				});

				if (results.length === 0) {
					return;
				}

				if ($.isFunction(me.settings.onActive)) {
					var activeItem, iIdx;

					me.callInactive();

					iIdx = Math.floor((results.length - 1) / 2);
					activeItem = results[iIdx];
					me.settings.onActive.call(me, activeItem);

					me.$previousItem = activeItem;
				}
			},
			callInactive: function () {
				var me = this;

				if (me.$previousItem && $.isFunction(me.settings.onInActive)) {
					me.settings.onInActive.call(me, me.$previousItem);
				}
			}
		});

		function isInViewport(el, viewport) {
			var elTop = el.offset().top,
				elBottom = elTop + el.outerHeight(),
				viewportTop = viewport.scrollTop(),
				viewportBottom = viewportTop + viewport.height();

			return elBottom > viewportTop && elTop < viewportBottom;
		}

		////////////////////////////////////////

		$.fn[pluginName] = function (options) {
			return this.each(function () {
				if (!$.data(this, pluginName)) {
					$.data(this, pluginName, new Plugin(this, options));
				}
			});
		};

	})(jQuery, window, document);
});
/* ============================================
mospinner - numeric value with up/down buttons

properties
    value
    max
    min
events
    onChange()
methods
    val()           // return integer
    set(int)        // set value    
    destroy()       // destroy plugin

ie

$("#spinner").mospinner({
    min: 3,
    max: 6,
    value: 4,
    onChange: function(iValue) {
        console.log(iValue);
    }
});    

$("#spinner").data("mospinner").set(5);
alert($("#spinner").data("mospinner").val());
===============================================*/

define("mospinner", ["jquery"], function (jQuery) {

    ;( function( $, window, document, undefined ) {
	    "use strict";
    
        // Create the defaults once
        var pluginName = "mospinner",
            defaults = {
                value: 0,
                min: 0,
                max: 100,
                onChange: null,
            };

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.el = element;
            this.$el = $(this.el);
            this.settings = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        }

        // Avoid Plugin.prototype conflicts
        $.extend( Plugin.prototype, {
            init: function() {
                var me = this;
                            
                me.render();                
            },
            render: function() {
                this.$el.addClass("mo_spinner")
                .html("<span class='mo_txt'></span>" +
                    "<span class='mo_arrow_wrapper'>" +
                        "<span class='mo_arrow mo_arrow_up'></span>" +
                        "<span class='mo_arrow mo_arrow_down'></span>" +
                    "</span>");            
                
                this.bindEvents();
            },
            destroy: function() {
                this.unbindEvents();
                this.$el.removeData();
            },
            bindEvents: function() {
                var me = this;
                
                me.$txt = me.$el.find(".mo_txt");                
                me.$butUp = me.$el.find(".mo_arrow_up");
                me.$butDown = me.$el.find(".mo_arrow_down");
            
                me.set(me.settings.value);
                me.$el.on('click'+'.'+me._name, ".mo_arrow_up", me, me.up);
                me.$el.on('click'+'.'+me._name, ".mo_arrow_down", me, me.down);
            },            
            unbindEvents: function() {
                this.$el.off('.'+this._name);
            },
            up: function(event) {               
                event.data.calculate(1);
            },
            down: function(event) {
                event.data.calculate(-1);
            },
            calculate: function(iNum) {
                var me = this;
                
                me.set(me.settings.value + iNum);                
                if ($.isFunction(me.settings.onChange)) {
                    me.settings.onChange.call(this, me.settings.value);
                }
            },
            val: function() {
                return this.settings.value;
            },
            set: function(iValue) {
                var me = this;
                
                var iNum = ($.isNumeric(iValue)) ? iValue : 0;
                switch(true) {
                    case iNum < me.settings.min:
                        iNum = me.settings.min;
                        break;
                    case iNum > me.settings.max:
                        iNum = me.settings.max;
                        break;
                }
                me.settings.value = iNum;
                me.$txt.text(iNum);
            }            
        } );

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function( options ) {
            return this.each( function() {
                if ( !$.data( this, pluginName ) ) {
                    $.data( this, pluginName, new Plugin( this, options ) );
                }
            } );
        };

    } )( jQuery, window, document );

    return jQuery.fn.mospinner;
});
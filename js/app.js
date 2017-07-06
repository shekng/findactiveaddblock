'use strict';

//Configure require.js
require.config({
  shim: {
  underscore: {
        deps: [
            'jquery'
        ],
        exports: '_'
    },
    mospinner: {
        deps: [
            'jquery'
        ],
        exports: 'mospinner'
    }
  },
  paths: {
      jquery: 'jquery-2.0.3.min',
      underscore: 'underscore',
      findactiveaddblock: 'jquery.mo.findactiveaddblock',      
  }
});

//Start up our App
require([
    'jquery',
    'underscore',
    'findactiveaddblock'
], 
function ($, findactiveaddblock) {
    $("#enable").click(function(){
        $(".wrapper").findactiveaddblock({
            children: $('.block'),
            onGetDomElement: function(obj) {
                return obj;  
            },
            onActive: function(oParam) {
                console.log(2);
                oParam.$el.css({border: "5px solid red"});
            },
            onInActive: function(oParam) {
                oParam.$el.css({border: 'none'});
            }
        }); 
    });
    
    $("#destroy").click(function(){
        $(".wrapper").data("findactiveaddblock").destroy();
    });
    
    var arr = [ 
        $('.block')[0],
        $('.block')[1],
        $('.block')[2],
    ]; 
    
    $(".wrapper").findactiveaddblock({
        //children: arr,
        children: $('.block'),        
        onGetDomElement: function(obj) {
            return obj;  
        },   
        onActive: function(oParam) {
            console.log(1);
            oParam.$el.css({border: "5px solid red"});
        },
        onInActive: function(oParam) {
            oParam.$el.css({border: 'none'});
        }
    });   
});
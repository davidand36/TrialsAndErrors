/*
    svgCanvas.js
*/

(function ( $ ) {
    'use strict';

    var imageContextMap = {};
    makeCanvasesForImages( );

    $('#svg1').on( 'click', reportTransparent1 );
    $('#svg2').on( 'click', reportTransparent2 );
    $('#svg3').on( 'click', reportTransparent3 );

    //=========================================================================

    function reportTransparent1( event ) {
        var el = document.elementFromPoint( event.clientX, event.clientY );
        var x = event.clientX - el.getBoundingClientRect().left;
        var y = event.clientY - el.getBoundingClientRect().top;
        var w = el.width;
        var h = el.height;

        var ctx = makeCanvasContextFromImage( el, w, h );
        var data = ctx.getImageData( x, y, 1, 1 ).data;
        var isTransparent = (data[3] === 0);
        console.log( 'Transparent1: ' + isTransparent );
    }

    //=========================================================================

    function reportTransparent2( event ) {
        var el = document.elementFromPoint( event.clientX, event.clientY );
        var x = event.clientX - el.getBoundingClientRect().left;
        var y = event.clientY - el.getBoundingClientRect().top;
        var w = el.width;
        var h = el.height;

        var src = el.src;
        $.get( src, function( svgSrc ) {
            var dataUrl = 'data:image/svg+xml;base64,' + btoa( svgSrc );
            var dataImg = new Image();
            dataImg.onload = function( ) {
                var ctx = makeCanvasContextFromImage( dataImg, w, h );
                var data = ctx.getImageData( x, y, 1, 1 ).data;
                var isTransparent = (data[3] === 0);
                console.log( 'Transparent2: ' + isTransparent );
            };
            dataImg.src = dataUrl;
        },
        'text' );
    }

    //=========================================================================

    function makeCanvasesForImages( ) {
        $('img').each( function( i, img ) {
            var w = img.width;
            var h = img.height;
            var src = img.src;
            if ( src.includes( '.svg' ) ) {
                $.get( src, function( svgSrc ) {
                    var dataUrl = 'data:image/svg+xml;base64,' + btoa( svgSrc );
                    var dataImg = new Image();
                    dataImg.onload = function( ) {
                        imageContextMap[ src ] = makeCanvasContextFromImage( dataImg, w, h );
                    };
                    dataImg.src = dataUrl;
                },
                'text' );
            } else {
                imageContextMap[ src ] = makeCanvasContextFromImage( img, w, h );
            }
        } );
    }

    //-------------------------------------------------------------------------

    function reportTransparent3( event ) {
        var el = document.elementFromPoint( event.clientX, event.clientY );
        var x = event.clientX - el.getBoundingClientRect().left;
        var y = event.clientY - el.getBoundingClientRect().top;
        var ctx = imageContextMap[ el.src ];
        if ( ! ctx ) {
            console.warn( 'No ctx for ' + src );
        }
        var data = ctx.getImageData( x, y, 1, 1 ).data;
        var isTransparent = (data[3] === 0);
        console.log( 'Transparent3: ' + isTransparent );
    }

    //=========================================================================

    function makeCanvasContextFromImage( img, w, h ) {
        var canvas = document.createElement( 'canvas' );
        var ctx = canvas.getContext( '2d' );
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage( img, 0, 0, w, h );
        return ctx;
    }


})( $ );

/*
    draw.js

    Simple canvas-based drawing program
*/

(function() {
'use strict';

var canvas;
var context;
var CONFIG_KEY = 'Draw_Config';
var STATE_KEY = 'Draw_State';
var defaultConfig = {
    width: 800,
    height: 600,
    color: '#000000',
    lineWidth: 10
}
var $drawingArea = $('#drawingArea');
var heightWidthRatio = defaultConfig.height / defaultConfig.width;
var canvasScale = 1.0;
var lastPos;

//=============================================================================

init( );
$drawingArea.on( 'mousedown touchstart', startPath );
$(window).on( 'resize', resize );
$('#color').on( 'click change input', changeColor );
$('#eraser').on( 'click', setEraser );
$('#clear').on( 'click', clearCanvas );
$('#lineWidth').on( 'change input', changeLineWidth );

//=============================================================================

function init( ) {
    var config = getConfig( );
    var savedState = getSavedState( );
    createCanvas( config );
    resize( );
    setContextSettings( config );
    setToolVals( config );
    restoreDrawing( savedState );

    //=========================================================================

    function getConfig( ) {
        var conf = {};
        var configString = localStorage[ CONFIG_KEY ];
        if ( configString ) {
            conf = JSON.parse( configString );
        }
        $.extend( conf, defaultConfig );
        heightWidthRatio = conf.height / conf.width;
        return conf;
    }

    //=========================================================================

    function getSavedState( ) {
        var stateString = localStorage[ STATE_KEY ];
        if ( stateString ) {
            return JSON.parse( stateString );
        } else {
            return { };
        }
    }

    //=========================================================================

    function createCanvas( config ) {
        $drawingArea.css( 'max-width', config.width );
        canvas = $('<canvas>')[0];
        canvas.width = config.width;
        canvas.height = config.height;
        $('#drawingArea').append( $(canvas) );
        context = canvas.getContext( '2d' );
    }

    //=========================================================================

    function setContextSettings( config ) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = config.color;
        context.lineWidth = config.lineWidth;
    }

    //=========================================================================

    function setToolVals( config ) {
        $('#color').val( config.color );
        $('#lineWidth').val( config.lineWidth );
    }
}

//=============================================================================

function startPath( evt ) {
    evt.preventDefault( );
    var pos = getCanvasPos( evt );
    context.beginPath( );
    context.moveTo( pos.x, pos.y );

    $drawingArea.on( 'mousemove touchmove', continuePath );
    $(window).on( 'mouseup touchend', finishPath );
    $drawingArea.on( 'mouseleave', finishPath );
}

//-----------------------------------------------------------------------------

function continuePath( evt ) {
    evt.preventDefault( );
    var pos = getCanvasPos( evt );
    context.lineTo( pos.x, pos.y );
    context.stroke( );
}

//-----------------------------------------------------------------------------

function finishPath( evt ) {
    evt.preventDefault( );
    $drawingArea.off( 'mousemove touchmove', continuePath );
    $(window).off( 'mouseup touchend', finishPath );
    $drawingArea.off( 'mouseleave', finishPath );
    saveDrawing( );
}

//=============================================================================

function changeColor( evt ) {
    context.strokeStyle = $(this).val();
    context.globalCompositeOperation = 'source-over';
}

//-----------------------------------------------------------------------------

function setEraser( evt ) {
    context.globalCompositeOperation = 'destination-out';
}

//-----------------------------------------------------------------------------

function clearCanvas( evt ) {
    if ( window.confirm( 'Erase everything? But your nice picture...' ) ) {
        context.clearRect( 0, 0, canvas.width, canvas.height );
        clearSavedDrawing( );
        context.globalCompositeOperation = 'source-over';
    }
}

//-----------------------------------------------------------------------------

function changeLineWidth( evt ) {
    context.lineWidth = $(this).val();
}

//=============================================================================

function getCanvasPos( evt ) {
    var offset = $drawingArea.offset();
    var cx = (evt.clientX !== undefined) ? evt.clientX : evt.touches[0].clientX;
    var cy = (evt.clientY !== undefined) ? evt.clientY : evt.touches[0].clientY;
    var x = cx - offset.left + $(document).scrollLeft();
    var y = cy - offset.top + $(document).scrollTop();
    x *= canvasScale;
    y *= canvasScale;
    return {
        x: x,
        y: y
    }
}

//=============================================================================

function resize( ) {
    var daWidth = $drawingArea.width();
    var daHeight = daWidth * heightWidthRatio;
    $drawingArea.css( { height: daHeight } );
    canvasScale = canvas.width / daWidth;
}

//=============================================================================

function saveDrawing( ) {
    var imgData = canvas.toDataURL( );
    localStorage[ STATE_KEY ] = JSON.stringify( {
        imgData: imgData
    } );
}

//-----------------------------------------------------------------------------

function restoreDrawing( state ) {
    if ( state.imgData ) {
        var img = new Image;
        img.src = state.imgData;
        img.onload = function( ) {
            context.drawImage( img, 0, 0 );
        }
    }
}

//-----------------------------------------------------------------------------

function clearSavedDrawing( ) {
    localStorage[ STATE_KEY ] = JSON.stringify( {
    } );
}

//=============================================================================

})();

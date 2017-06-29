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
var drawing = true;
var lastPos;

//=============================================================================

init( );
$drawingArea.on( 'mousedown', startPath );
$(window).on( 'resize', resize );
$('#color').on( 'change input', changeColor );
$('#eraser').on( 'click', setEraser );
$('#clear').on( 'click', clearCanvas );
$('#lineWidth').on( 'change input', changeLineWidth );

//=============================================================================

function init( ) {
    var config = getConfig( );
    var savedState = getSavedState( );
    canvas = createCanvas( config );
    resize( );
    context = canvas.getContext( '2d' );
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
        var canvas = $('<canvas>')[0];
        canvas.width = config.width;
        canvas.height = config.height;
        $('#drawingArea').append( $(canvas) );
        return canvas;
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
    var pos = getCanvasPos( evt );
    if ( drawing ) {
        context.beginPath( );
        context.moveTo( pos.x, pos.y );
    } else {
        eraseAt( pos );
        lastPos = pos;
    }

    $drawingArea.on( 'mousemove', continuePath );
    $drawingArea.on( 'mouseup', finishPath );
}

//-----------------------------------------------------------------------------

function continuePath( evt ) {
    var pos = getCanvasPos( evt );
    if ( drawing ) {
        context.lineTo( pos.x, pos.y );
        context.stroke( );
    } else {
        eraseSegment( lastPos, pos );
        lastPos = pos;
    }
}

//-----------------------------------------------------------------------------

function finishPath( evt ) {
    $drawingArea.off( 'mousemove mouseup' );
    saveDrawing( );
}

//-----------------------------------------------------------------------------

function eraseAt( pos ) {
    var lw = context.lineWidth;
    context.clearRect( pos.x - lw / 2, pos.y - lw / 2, lw, lw );
}

//-----------------------------------------------------------------------------

function eraseSegment( pos1, pos2 ) {
    //!!!Bressenham
    eraseAt( pos2 );
}

//=============================================================================

function changeColor( evt ) {
    context.strokeStyle = $(this).val();
    drawing = true;
}

//-----------------------------------------------------------------------------

function setEraser( evt ) {
    drawing = false;
}

//-----------------------------------------------------------------------------

function clearCanvas( evt ) {
    if ( window.confirm( 'Erase everything? But your nice picture...' ) ) {
        context.clearRect( 0, 0, canvas.width, canvas.height );
        clearSavedDrawing( );
        drawing = true;
    }
}

//-----------------------------------------------------------------------------

function changeLineWidth( evt ) {
    context.lineWidth = $(this).val();
}

//=============================================================================

function getCanvasPos( evt ) {
    var offset = $drawingArea.offset();
    var x = evt.clientX - offset.left;
    var y = evt.clientY - offset.top;
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

})();

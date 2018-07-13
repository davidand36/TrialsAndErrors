/*
    keydownHighlight.js
*/

(function() {
    $('body').on( 'keydown', handleKey );

    var currentEl;

    function handleKey( evt ) {
        var preventDefault = false;

        switch ( evt.which ) {
            case 9: //tab
                logTab( );
                if ( evt.shiftKey ) {
                    preventDefault = changeCurrent( -1 );
                } else {
                    preventDefault = changeCurrent( 1 );
                }
                break;
            case 13: //enter
                triggerCurrent( );
                preventDefault = true;
                break;
        }

        if ( preventDefault ) {
            evt.preventDefault( );
        }
    }

    function changeCurrent( offset ) {
        var availElements = getAvailableElements( );

        var numAvail = availElements.length;
        if ( numAvail === 0 ) {
            console.error( 'numAvail is 0.' );
            return false;
        }
        var index = availElements.indexOf( currentEl );

        if ( currentEl ) {
            setHighlight( currentEl, false );
        }

        if ( index < 0 ) {
            if ( offset >= 0 ) {
                index = 0;
            } else {
                index = numAvail - 1;
            }
        } else {
            index += offset;
            if ( index < 0 ) {
                currentEl = null;
                return false;
            } else if ( index >= numAvail ) {
                currentEl = null;
                return false;
            }
        }

        currentEl = availElements[ index ];
        setHighlight( currentEl, true );
        return true;
    }

    function triggerCurrent( ) {
        if ( currentEl ) {
            $(currentEl).trigger( 'click' );
        }
    }

    function getAvailableElements( ) {
        return $('button').toArray( );
    }

    function logTab( ) {
        var currentElString = 'none';
        if ( currentEl ) {
            currentElString = $(currentEl).attr( 'id' ) || currentEl;
        }
        console.log( 'Tab keydown. CurrentEl=' + currentElString );
    }
})();

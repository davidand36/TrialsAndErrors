/*
    focusHighlight.js
*/

(function() {
    $('*').on( 'focus', setHighlightOn );
    $('*').on( 'blur', setHighlightOff );

    function setHighlightOn( ) {
        setHighlight( this, true );
    }

    function setHighlightOff( ) {
        setHighlight( this, false );
    }
})();

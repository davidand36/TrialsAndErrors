/*
    setHighlight.js
*/

function setHighlight( el, on ) {
    var $el = $(el);
    if ( on ) {
        $el.addClass( 'kbd-highlighted' );
        reportHighlight( $el );
    } else {
        $el.removeClass( 'kbd-highlighted' );
    }

    function reportHighlight( $el ) {
        var id = $el.attr( 'id' );
        if ( id ) {
            console.log( 'Highlight on ' + id );
        } else {
            console.log( 'Highlight on ', $el );
        }
    }
}

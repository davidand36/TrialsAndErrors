/*
    logFocus.js
*/

(function( ) {
    $('*').on( 'focus', logFocus );

    function logFocus( evt ) {
        var $el = $(this);
        var id = $el.attr( 'id' );
        if (id) {
            console.log('Focus on ' + id);
        } else {
            console.log('Focus on ', $el);
        }
    }
})();

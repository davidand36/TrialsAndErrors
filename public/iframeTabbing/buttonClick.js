/*
    buttonClick.js
*/

(function( ) {
    $( 'button' ).on( 'click', logButtonClick );

    function logButtonClick( ) {
        console.log( 'Button clicked: ' + $(this).text() );
    }
})();

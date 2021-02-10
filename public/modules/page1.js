import page2 from './page2.js';

export default {
    run
};

function run () {
    const pageHtml = '<h2>Page 1</h2>' +
        '<button type="button" id="page2">Page 2</button>';

    $( 'main' ).html( pageHtml );
    $( '#page2' ).on( 'click', () => { page2.run(); } );
}

import page1 from './page1.js';

export default {
    run
};

function run() {
    const pageHtml = '<h2>Page 2</h2>' +
        '<button type="button" id="page1">Page 1</button>';

    $( 'main' ).html( pageHtml );
    $( '#page1' ).on( 'click', () => { page1.run(); } );
}

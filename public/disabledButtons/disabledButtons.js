/*
    disabledButtons.js

    Code for testing some approaches to disabling buttons
*/

setupAttrForm( );
setupAriaForm( );
setupNonvisualForm( );

//=============================================================================

function setupAttrForm( ) {
    var $input = $('#attrForm input');
    var $button = $('#attrForm button');
    var $output = $('#attrForm .output')

    disableButton( $button );
    $input.on( 'change input', handleInput );
    $button.on( 'click', handleSubmit );

    function handleInput( ) {
        $output.empty( );
        if ( $input.val().length ) {
            enableButton( $button );
        } else {
            disableButton( $button );
        }
    }

    function handleSubmit( ) {
        if ( isButtonEnabled( $button) ) {
            $output.text( 'You entered "' + $input.val() + '"');
        }
    }

    function enableButton( btn ) {
        $(btn).prop( 'disabled', false );
    }

    function disableButton( btn ) {
        $(btn).prop( 'disabled', true );
    }

    function isButtonEnabled( btn ) {
        return $(btn).prop( 'disabled' ) === false;
    }
}

//=============================================================================

function setupAriaForm( ) {
    var $input = $('#ariaForm input');
    var $button = $('#ariaForm button');
    var $output = $('#ariaForm .output')

    disableButton( $button );
    $input.on( 'change input', handleInput );
    $button.on( 'click', handleSubmit );

    function handleInput( ) {
        $output.empty( );
        if ( $input.val().length ) {
            enableButton( $button );
        } else {
            disableButton( $button );
        }
    }

    function handleSubmit( ) {
        if ( isButtonEnabled( $button) ) {
            $output.text( 'You entered "' + $input.val() + '"');
        }
    }

    function enableButton( btn ) {
        $(btn).attr( 'aria-disabled', 'false' );
        var origTabindex = $(btn).attr( 'data-orig-tabindex' ) || 0;
        $(btn).attr( 'tabindex', origTabindex );
    }

    function disableButton( btn ) {
        $(btn).attr( 'aria-disabled', 'true' );
        var origTabindex = $(btn).attr( 'tabindex' ) || 0;
        $(btn).attr( 'data-orig-tabindex', origTabindex );
        $(btn).attr( 'tabindex', -1 );
    }

    function isButtonEnabled( btn ) {
        return $(btn).attr( 'aria-disabled' ) !== 'true';
    }
}

//=============================================================================


function setupNonvisualForm( ) {
    var $input = $('#nonvisualForm input');
    var $button = $('#nonvisualForm button');
    var $output = $('#nonvisualForm .output')

    disableButton( $button );
    $input.on( 'change input', handleInput );
    $button.on( 'click', handleSubmit );

    function handleInput( ) {
        $output.empty( );
        if ( $input.val().length ) {
            enableButton( $button );
        } else {
            disableButton( $button );
        }
    }

    function handleSubmit( ) {
        if ( isButtonEnabled( $button) ) {
            $output.text( 'You entered "' + $input.val() + '"');
        }
    }

    function enableButton( btn ) {
        $(btn).removeClass( 'disabled' );
        $(btn).find( '.nonvisual' ).remove( );
        var origTabindex = $(btn).attr( 'data-orig-tabindex' ) || 0;
        $(btn).attr( 'tabindex', origTabindex );
    }

    function disableButton( btn ) {
        $(btn).addClass( 'disabled' );
        var $nonvis = $('<span>')
            .addClass( 'nonvisual' )
            .text( 'disabled' );
        $(btn).append( $nonvis );
        var origTabindex = $(btn).attr( 'tabindex' ) || 0;
        $(btn).attr( 'data-orig-tabindex', origTabindex );
        $(btn).attr( 'tabindex', -1 );
    }

    function isButtonEnabled( btn ) {
        return $(btn).hasClass( 'disabled' ) === false;
    }
}

//=============================================================================

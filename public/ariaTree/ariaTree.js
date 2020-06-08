/*
    ariaTree.js
*/

var colors = [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet' ];

initAriaMarkup( );
setupEventHandlers( );
setFocusToFirstItem( );
setButtonVisibility( );
initColorButtons( );

function initAriaMarkup( ) {
    $( '.level.root' )
        .attr( 'role', 'tree' )
        .attr( 'aria-labelledby', 'title' );
    $( '.level' ).not( '.root' ).not( '.header' )
        .attr( 'role', 'group' );
    $( '.item' )
        .attr( 'role', 'treeitem' );
    $( '.item' ).not( '.leaf' )
        .attr( 'aria-expanded', 'false' );
}

function setupEventHandlers( ) {
    $( document ).on( 'click', '.item', handleItemClick );
    $( document ).on( 'keydown', '.item', handleItemKeydown );
    $( document ).on( 'focus', '.item', handleItemFocus );
    $( document ).on( 'blur', '.item', handleItemBlur );
    //The next three are just for logging/debugging Chrome+JAWS
    $( document ).on( 'focus', '.item :input', handleItemButtonFocus );
    $( document ).on( 'blur', '.item :input', handleItemButtonBlur );
    $( document ).on( 'keydown', '.item :input', handleItemButtonKeydown );
    $( '#expandAll, #expandAllB' ).on( 'click', expandAll );
    $( '#collapseAll, #collapseAllB' ).on( 'click', collapseAll );
}

function handleItemClick( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }

    var $item = $( evt.currentTarget );
    var ariaExpanded = $item.attr( 'aria-expanded' );

    if ( ariaExpanded === 'true' ) {
        collapseTreeItem( $item );
        evt.stopPropagation();
    } else if ( ariaExpanded === 'false' ) {
        expandTreeItem( $item );
        evt.stopPropagation();
    }
}

function handleItemKeydown( evt ) {
    var stopPropAndDefault = false;
    if ( evt.ctrlKey || evt.altKey || evt.metaKey ) {
        return;
    }
    var $item = $( evt.target );
    if ( ! $item.is( '.item' ) ) {
        return;
    }
    var ariaExpanded = $item.attr( 'aria-expanded' );
    switch ( evt.which ) {
        case 38: //Up
        {
            setFocusToPreviousItem( $item );
            stopPropAndDefault = true;
            break;
        }
        case 40: //Down
        {
            setFocusToNextItem( $item );
            stopPropAndDefault = true;
            break;
        }
        case 37: //Left
        {
            if ( ariaExpanded === 'true' ) {
                collapseTreeItem( $item)
            } else {
                setFocusToParentItem( $item );
            }
            stopPropAndDefault = true;
            break;
        }
        case 39: //Right
        {
            if ( ariaExpanded === 'true' ) {
                setFocusToNextItem( $item );
            } else if ( ariaExpanded === 'false' ) {
                expandTreeItem( $item );
            }
            stopPropAndDefault = true;
            break;
        }
        case 36: //Home
        {
            setFocusToFirstItem( );
            stopPropAndDefault = true;
            break;
        }
        case 35: //End
        {
            setFocusToLastItem( );
            stopPropAndDefault = true;
            break;
        }
        case 13: //Enter
        case 32: //Space
        {
            console.log( 'handleItemKeydown (' + evt.which + ')', evt.currentTarget );
            if ( ariaExpanded === 'true' ) {
                collapseTreeItem( $item );
            } else if ( ariaExpanded === 'false' ) {
                expandTreeItem( $item );
            }
            stopPropAndDefault = true;
            break;
        }
    }

    if ( stopPropAndDefault ) {
        evt.stopPropagation( );
        evt.preventDefault( );
    }
}

function handleItemFocus( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }
    evt.stopPropagation();
    console.log( 'handleItemFocus', evt.currentTarget );
    var $item = $( evt.currentTarget );
    var $itemWrap = $item.children( '.itemWrap' ).first();
    $itemWrap.addClass( 'focus' );
}

function handleItemBlur( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }
    evt.stopPropagation();
    var $item = $( evt.currentTarget );
    var $itemWrap = $item.children( '.itemWrap' ).first();
    $itemWrap.removeClass( 'focus' );
}

//Other than for logging, this doesn't seem necessary or helpful
function handleItemButtonFocus( evt ) {
    evt.stopPropagation();
    console.log( 'handleItemButtonFocus', evt.currentTarget );
}

//Other than for logging, this doesn't seem necessary or helpful
function handleItemButtonBlur( evt ) {
    evt.stopPropagation();
}

//Other than for logging, this doesn't seem necessary or helpful
function handleItemButtonKeydown( evt ) {
    if ( evt.which === 13 || evt.which === 32 ) { //enter or space
        evt.stopPropagation();
        console.log( 'handleItemButtonKeydown (' + evt.which + ')', evt.currentTarget );
    }
}

function isTargetInteractive( evt ) {
    var $target = $( evt.target );
    return $target.is( ':input' );
}

function setFocusToItem( $item ) {
    if ( ! $item ) {
        return;
    }
    $( '.item' ).attr( 'tabIndex', -1 );
    $item.attr( 'tabIndex', 0 ).focus();
}

function setFocusToPreviousItem( $item ) {
    var $prevItem;
    var $items = $( '.item' );
    for ( var i = 0, len = $items.length; i < len; ++i ) {
        var $ti = $items.eq( i );
        if ( $ti[0] === $item[0] ) {
            break;
        }
        if ( $ti.is(':visible' ) ) {
            $prevItem = $ti;
        }
    }
    setFocusToItem( $prevItem );
}

function setFocusToNextItem( $item ) {
    var $nextItem;
    var $items = $( '.item' );
    for ( var i = $items.length - 1; i >= 0; --i ) {
        var $ti = $items.eq( i );
        if ( $ti[0] === $item[0] ) {
            break;
        }
        if ( $ti.is(':visible' ) ) {
            $nextItem = $ti;
        }
    }
    setFocusToItem( $nextItem );
}

function setFocusToFirstItem( ) {
    setFocusToItem( $( '.item:visible' ).first() );
}

function setFocusToLastItem( ) {
    setFocusToItem( $( '.item:visible' ).last() );
}

function setFocusToParentItem( $item ) {
    setFocusToItem( $item.parent().closest( '.item' ) );
}

function expandTreeItem( $item ) {
    if ( $item.attr( 'aria-expanded' ) === 'false' ) {
        $item.attr( 'aria-expanded', 'true' );
        setButtonVisibility();
    }
}

function collapseTreeItem( $item ) {
    var $groupTreeItem;
    if ( $item.attr( 'aria-expanded' ) === 'true' ) {
        $groupTreeItem = $item;
    } else {
        $groupTreeItem = $item.parent( '.item' );
    }

    if ( $groupTreeItem ) {
        $groupTreeItem.attr( 'aria-expanded', 'false' );
        setFocusToItem( $groupTreeItem );
        setButtonVisibility();
    }
}

function setButtonVisibility( setFocus ) {
    if ( $( '[aria-expanded="true"]' ).length > 0 ) {
        $( '#collapseAll, #collapseAllB' ).show( );
        if ( setFocus ) {
            $( '#collapseAll' ).focus();
        }
    } else {
        $( '#collapseAll, #collapseAllB' ).hide( );
    }
    if ( $( '[aria-expanded="false"]' ).length > 0 ) {
        $( '#expandAll, #expandAllB' ).show( );
        if ( setFocus ) {
            $( '#expandAll' ).focus();
        }
    } else {
        $( '#expandAll, #expandAllB' ).hide( );
    }
}

function expandAll( ) {
    $( '[aria-expanded="false"]' ).attr( 'aria-expanded', 'true' );
    setButtonVisibility( true );
}

function collapseAll( ) {
    $( '[aria-expanded="true"]' ).attr( 'aria-expanded', 'false' );
    var $curItem = $( '.item[ tabindex=0 ]' );
    if ( ! $curItem.is( ':visible' ) ) {
        setFocusToItem( $curItem.closest( '.item:visible' ) );
    }
    setButtonVisibility( true );
}

function initColorButtons( ) {
    $( 'button.colors' ).each( function( i, btn ) {
        var c = Math.floor( Math.random() * colors.length );
        setColorButton( $(btn), c );
    } );
    $( 'button.colors' ).on( 'click', handleColorButtonClick );
}

function handleColorButtonClick( evt ) {
    evt.stopPropagation();
    evt.preventDefault();
    var $btn = $( this );
    var c = parseInt( $btn.attr( 'data-color' ), 10 );
    if ( ++c >= colors.length ) {
        c = 0;
    }
    setColorButton( $btn, c );
}

function setColorButton( $btn, c ) {
    var color = colors[ c ];
    $btn.attr( 'data-color', c )
        .css( 'background-color', color )
        .text( color );
}

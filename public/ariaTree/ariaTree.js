/*
    ariaTree.js
*/

initAriaMarkup( );
setupEventHandlers( );
setFocusToFirstItem( );

function initAriaMarkup( ) {
    $('.level.root')
        .attr( 'role', 'tree' )
        .attr( 'aria-labelledby', 'title' );
    $('.level').not('.root').not('.header')
        .attr( 'role', 'group' );
    $('.item')
        .attr( 'role', 'treeitem' );
    $('.item').not('.leaf')
        .attr( 'aria-expanded', 'false' );
}

function setupEventHandlers( ) {
    $( document ).on( 'click', '.item', handleItemClick );
    $( document ).on( 'keydown', '.item', handleKeydown );
}

function handleItemClick( evt ) {
    var $item = $( evt.target );
    var ariaExpanded = $item.attr( 'aria-expanded' );

    if ( ariaExpanded === 'true' ) {
        collapseTreeItem( $item );
        evt.stopPropagation();
    } else if ( ariaExpanded === 'false' ) {
        expandTreeItem( $item );
        evt.stopPropagation();
    }
}

function handleKeydown( evt ) {
    var stopPropAndDefault = false;
    if ( evt.ctrlKey || evt.altKey || evt.metaKey ) {
        return;
    }
    var $item = $(evt.currentTarget);
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

function setFocusToItem( $item ) {
    $( '.itemWrap' ).attr( 'tabIndex', -1 );
    var $itemWrap = $item.children('.itemWrap').first();
    $itemWrap.attr( 'tabIndex', 0 ).focus( );
}

function setFocusToPreviousItem( $item ) {
    var item = $item[0];
    var $prevItem;
    var $items = $('.item');
    for ( var i = 0, len = $items.length; i < len; ++i ) {
        var ti = $items[i];
        var $ti = $(ti);
        if ( ti === item ) {
            break;
        }
        if ( $ti.is(':visible') ) {
            $prevItem = $ti;
        }
    }

    if ( $prevItem ) {
        setFocusToItem( $prevItem );
    }
}

function setFocusToNextItem( $item ) {
    var item = $item[0];
    var $nextItem;
    var $items = $('.item');
    for ( var i = $items.length - 1; i >= 0; --i ) {
        var ti = $items[i];
        var $ti = $(ti);
        if ( ti === item ) {
            break;
        }
        if ( $ti.is(':visible') ) {
            $nextItem = $ti;
        }
    }

    if ( $nextItem ) {
        setFocusToItem( $nextItem );
    }
}

function setFocusToFirstItem( ) {
    var $visItems = $('.item:visible');
    if ( $visItems.length > 0 ) {
        setFocusToItem( $visItems.first() );
    }
}

function setFocusToLastItem( ) {
    var $visItems = $( '.item:visible' );
    if ( $visItems.length > 0 ) {
        setFocusToItem( $visItems.last() );
    }
}

function setFocusToParentItem( $item ) {
    var $parent = $item.parent( '.item' );
    if ( $parent ) {
        setFocusToItem( $parent );
    }
}

function expandTreeItem( $item ) {
    if ( $item.attr( 'aria-expanded') === 'false' ) {
        $item.attr( 'aria-expanded', 'true' );
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
    }
}
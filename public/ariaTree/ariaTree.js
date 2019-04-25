/*
    ariaTree.js
*/

initAriaMarkup( );
setupEventHandlers( );
setFocusToFirstItem( );
setButtonVisibility( );

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
    $( document ).on( 'keydown', '.item', handleKeydown );
    $( '#expandAll, #expandAllB' ).on( 'click', expandAll );
    $( '#collapseAll, #collapseAllB' ).on( 'click', collapseAll );
}

function handleItemClick( evt ) {
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

function handleKeydown( evt ) {
    var stopPropAndDefault = false;
    if ( evt.ctrlKey || evt.altKey || evt.metaKey ) {
        return;
    }
    var $item = $( evt.currentTarget );
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
    if ( ! $item ) {
        return;
    }
    $( '.itemWrap' ).attr( 'tabIndex', -1 );
    var $itemWrap = $item.children('.itemWrap' ).first();
    $itemWrap.attr( 'tabIndex', 0 ).focus( );
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
    var $curItemWrap = $( '.itemWrap[ tabindex=0 ]' );
    if ( ! $curItemWrap.is( ':visible' ) ) {
        setFocusToItem( $curItemWrap.closest( '.item:visible' ) );
    }
    setButtonVisibility( true );
}

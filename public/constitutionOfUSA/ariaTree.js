/*
    ariaTree.js
*/

setupEventHandlers();
setFocusToFirstItem();
setButtonVisibility();

function setupEventHandlers() {
    $( document ).on( 'click', '[role="treeitem"]', handleItemClick );
    $( document ).on( 'keydown', '[role="treeitem"]', handleItemKeydown );
    $( document ).on( 'focus', '[role="treeitem"]', handleItemFocus );
    $( document ).on( 'blur', '[role="treeitem"]', handleItemBlur );
    $( '.expandAll' ).on( 'click', expandAll );
    $( '.collapseAll' ).on( 'click', collapseAll );
}

function handleItemClick( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }

    var $item = $( evt.currentTarget );
    var ariaExpanded = $item.attr( 'aria-expanded' );

    if ( ariaExpanded === 'true' ) {
        collapseTreeItem( $item );
    } else if ( ariaExpanded === 'false' ) {
        expandTreeItem( $item );
    }
    evt.stopPropagation();
}

function handleItemKeydown( evt ) {
    var stopPropAndDefault = false;
    if ( evt.ctrlKey || evt.altKey || evt.metaKey ) {
        return;
    }
    var $item = $( evt.target );
    if ( !$item.is( '[role="treeitem"]' ) ) {
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
                    collapseTreeItem( $item )
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
                setFocusToFirstItem();
                stopPropAndDefault = true;
                break;
            }
        case 35: //End
            {
                setFocusToLastItem();
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
        evt.stopPropagation();
        evt.preventDefault();
    }
}

function handleItemFocus( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }
    evt.stopPropagation();
    var $item = $( evt.currentTarget );
    var $itemText = $item.children( '.treeitem-text' ).first();
    $itemText.addClass( 'focus' );
}

function handleItemBlur( evt ) {
    if ( isTargetInteractive( evt ) ) {
        return;
    }
    evt.stopPropagation();
    var $item = $( evt.currentTarget );
    var $itemText = $item.children( '.treeitem-text' ).first();
    $itemText.removeClass( 'focus' );
}

function isTargetInteractive( evt ) {
    var $target = $( evt.target );
    return $target.is( ':input' );
}

function setFocusToItem( $item ) {
    if ( !$item ) {
        return;
    }
    $( '[role="treeitem"]' ).attr( 'tabIndex', -1 );
    $item.attr( 'tabIndex', 0 ).focus();
}

function setFocusToPreviousItem( $item ) {
    var $prevItem;
    var $items = $( '[role="treeitem"]' );
    for ( var i = 0, len = $items.length; i < len; ++i ) {
        var $ti = $items.eq( i );
        if ( $ti[ 0 ] === $item[ 0 ] ) {
            break;
        }
        if ( $ti.is( ':visible' ) ) {
            $prevItem = $ti;
        }
    }
    setFocusToItem( $prevItem );
}

function setFocusToNextItem( $item ) {
    var $nextItem;
    var $items = $( '[role="treeitem"]' );
    for ( var i = $items.length - 1; i >= 0; --i ) {
        var $ti = $items.eq( i );
        if ( $ti[ 0 ] === $item[ 0 ] ) {
            break;
        }
        if ( $ti.is( ':visible' ) ) {
            $nextItem = $ti;
        }
    }
    setFocusToItem( $nextItem );
}

function setFocusToFirstItem() {
    setFocusToItem( $( '[role="treeitem"]:visible' ).first() );
}

function setFocusToLastItem() {
    setFocusToItem( $( '[role="treeitem"]:visible' ).last() );
}

function setFocusToParentItem( $item ) {
    setFocusToItem( $item.parent().closest( '[role="treeitem"]' ) );
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
        $groupTreeItem = $item.parent( '[role="treeitem"]' );
    }

    if ( $groupTreeItem ) {
        $groupTreeItem.attr( 'aria-expanded', 'false' );
        setFocusToItem( $groupTreeItem );
        setButtonVisibility();
    }
}

function setButtonVisibility( setFocus ) {
    if ( $( '[aria-expanded="true"]' ).length > 0 ) {
        $( '.collapseAll' ).show();
        if ( setFocus ) {
            $( '.collapseAll' ).first().focus();
        }
    } else {
        $( '.collapseAll' ).hide();
    }
    if ( $( '[aria-expanded="false"]' ).length > 0 ) {
        $( '.expandAll' ).show();
        if ( setFocus ) {
            $( '.expandAll' ).first().focus();
        }
    } else {
        $( '.expandAll' ).hide();
    }
}

function expandAll() {
    $( '[aria-expanded="false"]' ).attr( 'aria-expanded', 'true' );
    setButtonVisibility( true );
}

function collapseAll() {
    $( '[aria-expanded="true"]' ).attr( 'aria-expanded', 'false' );
    var $curItem = $( '[role="treeitem"][ tabindex=0 ]' );
    if ( !$curItem.is( ':visible' ) ) {
        setFocusToItem( $curItem.closest( '[role="treeitem"]:visible' ) );
    }
    setButtonVisibility( true );
}

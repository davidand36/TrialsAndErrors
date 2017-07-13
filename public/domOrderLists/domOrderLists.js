/*
    domOrderLists.js

    Algorithm to consolidate lists
*/

var listConsolidator = (function() {
    var api = {
        consolidate: consolidate,
        fixup: fixupList
    };

    return api;

    //=========================================================================

    function consolidate( contentItems, dragObjects, dropZones ) {
        var collectedLists = collectLists( contentItems, dragObjects, dropZones );
        return makeConsolidatedList( collectedLists );
    }

    //=========================================================================

    function collectLists( contentItems, dragObjects, dropZones ) {
        return [
            {
                type: 'content',
                list: contentItems
            },
            {
                type: 'drag',
                list: dragObjects
            },
            {
                type: 'drop',
                list: dropZones
            }
        ];
    }

    //=========================================================================

    function makeConsolidatedList( collectedLists ) {
        var consList = [];
        collectedLists.forEach( function( listObj ) {
            listObj.list.forEach( function( item ) {
                if ( item.type ) {
                    if ( item.type !== listObj.type ) {
                        console.error( 'Item of type ' + item.type + ' in ' + listObj.type + ' list' );
                    }
                } else {
                    item.type = listObj.type;
                }

                if ( item.domOrder ) {
                    if ( consList[ item.domOrder ] !== undefined ) {
                        console.warn( 'Fixing DOM order collision at ' + item.domOrder );
                        item.domOrder = findOpenSlot( item.domOrder + 1 );
                    }
                } else {
                    item.domOrder = findOpenSlot( 0 );
                }
                consList[ item.domOrder ] = item;
            } );
        } );

        fixupList( consList );

        return consList;

        //---------------------------------------------------------------------

        function findOpenSlot( start ) {
            var i = start;
            while ( consList[ i ] !== undefined ) {
                ++i;
            }
            return i;
        }
    }

    //=========================================================================

    function fixupList( consolidatedList ) {

        removeGaps( );
        renumber( );

        //---------------------------------------------------------------------

        function removeGaps( ) {
            var gapFound = false;
            var i = 0;
            while ( i < consolidatedList.length ) {
                if ( consolidatedList[ i ] === undefined ) {
                    gapFound = true;
                    consolidatedList.splice( i, 1 );
                } else {
                    ++i;
                }
            }
            console.warn( 'Gap found and fixed.' );
        }

        //---------------------------------------------------------------------

        function renumber( ) {
            for ( var i = 0, len = consolidatedList.length; i < len; ++i ) {
                if ( consolidatedList[ i ] === undefined ) {
                    console.error( 'Gap in consolidated list at ' + i );
                } else {
                    consolidatedList[ i ].domOrder = i;
                }
            }
        }
    }

})();

//=============================================================================

// Tests

(function() {
    var legacyData = {
        contentItems: [
            {
                text: 'Item A'
            },
            {
                text: 'Item B'
            }
        ],
        dragObjects: [
            {
                text: 'Drag A'
            },
            {
                text: 'Drag B'
            }
        ],
        dropZones: [
            {
                text: 'Drop A'
            },
            {
                text: 'Drop B'
            }
        ]
    };
    var goodData = {
        contentItems: [
            {
                domOrder: 4,
                type: 'content',
                text: 'Text A'
            },
            {
                domOrder: 1,
                type: 'content',
                text: 'Text B'
            }
        ],
        dragObjects: [
            {
                domOrder: 3,
                type: 'drag',
                text: 'Drag A'
            },
            {
                domOrder: 2,
                type: 'drag',
                text: 'Drag B'
            }
        ],
        dropZones: [
            {
                domOrder: 0,
                type: 'drop',
                text: 'Drop A'
            },
            {
                domOrder: 5,
                type: 'drop',
                text: 'Drop B'
            }
        ]
    };
    var badData = {
        contentItems: [
            {
                domOrder: 5,
                type: 'drag',
                text: 'Content/Drag A'
            },
            {
                domOrder: 10,
                type: 'content',
                text: 'Content B'
            }
        ],
        dragObjects: [],
        dropZones: [
            {
                domOrder: 1,
                type: 'drop',
                text: 'Drop A'
            },
            {
                domOrder: 5,
                type: 'drop',
                text: 'Drop B'
            },
            {
                text: 'Drop C'
            }
        ]
    };
    var curData = legacyData;
    var consolidatedList;

    //=========================================================================

    $('#legacy').on( 'click', setLegacyAndTest );
    $('#good').on( 'click', setGoodAndTest );
    $('#bad').on( 'click', setBadAndTest );
    $('#shuffle').on( 'click', shuffleAndTest );
    $('#shuffle').prop( 'disabled', true );

    //=========================================================================

    function setLegacyAndTest( ) {
        curData = legacyData;
        testConsolidate( );
    }

    //-------------------------------------------------------------------------

    function setGoodAndTest( ) {
        curData = goodData;
        testConsolidate( );
    }

    //-------------------------------------------------------------------------

    function setBadAndTest( ) {
        curData = badData;
        testConsolidate( );
    }

    //-------------------------------------------------------------------------

    function shuffleAndTest( ) {
        if ( ! consolidatedList ) {
            console.error( "Lists haven't been consolidated." );
            return;
        }
        consolidatedList = _.shuffle( consolidatedList );
        testFixup( );
    }

    //=========================================================================

    function testConsolidate( ) {
        showBeforeData( );
        consolidatedList = listConsolidator.consolidate( curData.contentItems, curData.dragObjects, curData.dropZones );
        showAfterData( );
        $('#shuffle').prop( 'disabled', false );
    }

    //-------------------------------------------------------------------------

    function testFixup( ) {
        showBeforeData( );
        listConsolidator.fixup( consolidatedList );
        showAfterData( );
    }

    //=========================================================================

    function showBeforeData( ) {
        showList( consolidatedList, 'beforeConsolidated' );
        showList( curData.contentItems, 'beforeContent' );
        showList( curData.dragObjects, 'beforeDrag' );
        showList( curData.dropZones, 'beforeDrop' );
    }

    //-------------------------------------------------------------------------

    function showAfterData( ) {
        showList( consolidatedList, 'afterConsolidated' );
        showList( curData.contentItems, 'afterContent' );
        showList( curData.dragObjects, 'afterDrag' );
        showList( curData.dropZones, 'afterDrop' );
    }

    //-------------------------------------------------------------------------

    function showList( list, ulId ) {
        if ( ! list ) {
            return;
        }
        var $ul = $('#' + ulId);
        $ul.empty( );
        list.forEach( function( item ) {
            var $li = $('<li>');
            var tp = [];
            if ( item.domOrder !== undefined ) {
                tp.push( 'domOrder: ' + item.domOrder );
            }
            if ( item.type ) {
                tp.push( 'type: ' + item.type );
            }
            if ( item.text ) {
                tp.push( 'text: ' + item.text );
            }
            $li.text( tp.join( ', ' ) );
            $ul.append( $li );
        } );
    }
})();

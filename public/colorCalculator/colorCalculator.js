/*
  colorCalculator.js

  Main script for color calculator
*/

$('#baseColor').on( 'change', buildCalculatedColors );
$('#textColor').on('change', buildCalculatedColors);

function buildCalculatedColors() {
  const baseColorStr = $('#baseColor').val();
  const baseColor = tinycolor(baseColorStr);
  const textColorStr = $('#textColor').val();
  const textColor = tinycolor(textColorStr);

  $('#calculatedColors').empty();

  if (! baseColor.isValid()) {
    return;
  }

  let colors = [baseColor];
  let titles = ['Base'];
  if (textColor.isValid()) {
    colors.push(textColor);
    titles.push('Text');
  }
  let section = makeColorSequence('Colors', colors, titles);
  $( '#calculatedColors' ).append( section );

  if (textColor.isValid()) {
    section = $( '<div>' );
    let heading = $( '<p>Readability</p>' );
    section.append( heading );
    sequence = $( '<div>' ).addClass( 'color-sequence' );
    section.append( sequence );
    block = $( '<div>' );
    block.addClass( 'color-block' );
    block.css( {
      'background-color': baseColor.toString(),
      'color': textColor
    } );
    const readability = tinycolor.readability( baseColor, textColor ).toFixed( 2 );
    let p = $( '<p>' ).text( `Readability: ${readability}` );
    block.append( p );
    p = $( '<p>' ).css( { 'font-size': 'small' } ).text( 'Small text' );
    block.append( p );
    p = $( '<p>' ).css( { 'font-size': 'large' } ).text( 'Large text' );
    block.append( p );
    sequence.append( block );
    let table = makeReadabilityTable( baseColor, textColor );
    sequence.append( table );
    $( '#calculatedColors' ).append( section );
  }

  colors = [];
  titles = [];
  let lastColor = null;
  for ( let i = 10; i <= 100; i += 10 ) {
    const color = baseColor.clone().lighten( i );
    if ( lastColor && tinycolor.equals( color, lastColor ) ) {
      break;
    }
    lastColor = color;
    colors.push(color);
    titles.push(i);
  }
  section = makeColorSequence('Lighter', colors, titles);
  $('#calculatedColors').append(section);

  colors = [];
  titles = [];
  lastColor = null;
  for ( let i = 10; i <= 100; i += 10 ) {
    const color = baseColor.clone().brighten( i );
    if ( lastColor && tinycolor.equals( color, lastColor ) ) {
      break;
    }
    lastColor = color;
    colors.push( color );
    titles.push( i );
  }
  section = makeColorSequence( 'Brighter', colors, titles );
  $( '#calculatedColors' ).append( section );

  colors = [];
  titles = [];
  lastColor = null;
  for ( let i = 10; i <= 100; i += 10 ) {
    const color = baseColor.clone().darken( i );
    if ( lastColor && tinycolor.equals( color, lastColor ) ) {
      break;
    }
    lastColor = color;
    colors.push( color );
    titles.push( i );
  }
  section = makeColorSequence( 'Darker', colors, titles );
  $( '#calculatedColors' ).append( section );

  colors = baseColor.splitcomplement();
  titles = [ '0', '1', '2' ];
  section = makeColorSequence( 'Split Complement', colors, titles );
  $( '#calculatedColors' ).append( section );

  colors = baseColor.triad();
  titles = [ '0', '1', '2' ];
  section = makeColorSequence( 'Triad', colors, titles );
  $( '#calculatedColors' ).append( section );

  colors = baseColor.tetrad();
  titles = [ '0', '1', '2', '3' ];
  section = makeColorSequence( 'Split Complement', colors, titles );
  $( '#calculatedColors' ).append( section );
}

function makeColorBlock(title, color) {
  const block = $('<div>');
  block.addClass('color-block');
  block.css({
    'background-color': color.toString(),
    'color': color.isLight() ? 'black' : 'white'
  });
  const html = title + '<br>' +
    color.toHexString() + '<br>' +
    color.toRgbString() + '<br>' +
    color.toHsvString() + '<br>' +
    color.toHslString();
  block.html(html);
  return block;
}

function makeColorSequence(title, colors, titles) {
  const section = $( '<div>' );
  const heading = $( `<p>${title}</p>` );
  section.append( heading );
  const sequence = $( '<div>' ).addClass( 'color-sequence' );
  section.append( sequence );
  for (let i = 0, len = colors.length; i < len; ++i ) {
    const title = (titles && titles[i]) || '';
    const block = makeColorBlock(title, colors[i]);
    sequence.append(block);
  }
  return section;
}

function makeReadabilityTable(baseColor, textColor) {
  const table = $( '<table>' ).addClass( 'table' );
  let tr = $( '<tr>' );
  table.append( tr );
  let th = $( '<th>' );
  tr.append(th);
  th = $('<th>').text('Large text');
  tr.append( th );
  th = $( '<th>' ).text( 'Small text' );
  tr.append( th );
  tr = $( '<tr>' );
  table.append( tr );
  th = $( '<th scope="row">' ).text( 'WCAG AA' );
  tr.append(th);
  let td = $('<td>').text( readableText('AA', 'large'));
  tr.append(td);
  td = $( '<td>' ).text( readableText( 'AA', 'small' ) );
  tr.append( td );
  tr = $( '<tr>' );
  table.append( tr );
  th = $( '<th scope="row">' ).text( 'WCAG AAA' );
  tr.append(th);
  td = $( '<td>' ).text( readableText( 'AAA', 'large' ) );
  tr.append( td );
  td = $( '<td>' ).text( readableText( 'AAA', 'small' ) );
  tr.append( td );
  return table;

  function readableText(level, size) {
    return tinycolor.isReadable( baseColor, textColor, { level, size } ) ? 'Yes' : 'No';
  }
}

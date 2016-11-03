import SimpleDecorator from 'draft-js-simpledecorator';

import CssClassWrapper from './css-class-wrapper';

const matchIndices = ( text, query ) => {
	const chunks = [];
	const matcher = new RegExp( query, 'g' );
	let match;

	while ( ( match = matcher.exec( text ) ) !== null ) {
		chunks.push( [ match.index, matcher.lastIndex ] );
	}

	return chunks;
}

const dispatch = callback => ( [ start, end ] ) =>
	callback( start, end, { className: 'search-match' } );

export const findMatchingText = search => ( contentBlock, callback ) => {
	const text = contentBlock
		.getText()
		.toLocaleLowerCase();

	if ( ! search || ! text ) {
		return;
	}

	const query = search
		.toLocaleLowerCase();

	matchIndices( text, query )
		.forEach( dispatch( callback ) );
};

export const MatchingTextDecorator = search =>
	new SimpleDecorator(
		findMatchingText( search ),
		CssClassWrapper,
	);

export default MatchingTextDecorator;

import React, { Component, PropTypes } from 'react';
import {
	identity,
} from 'lodash';

const KEY_TAB = 9;

const startsWith = prefix => text =>
	text
		.trim()
		.toLowerCase()
		.startsWith( prefix.trim().toLowerCase() );

export class TagInput extends Component {
	static propTypes = {
		inputRef: PropTypes.func,
		onChange: PropTypes.func,
		onSelect: PropTypes.func,
		tagNames: PropTypes.arrayOf( PropTypes.string ).isRequired,
		value: PropTypes.string.isRequired,
	};

	static defaultProps = {
		inputRef: identity,
		onChange: identity,
		onSelect: identity,
	};

	interceptTabPress = event => {
		const { keyCode } = event;
		const { onSelect, tagNames, value } = this.props;

		if ( KEY_TAB !== keyCode ) {
			return;
		}

		if ( ! value.length ) {
			return;
		}

		const suggestion = tagNames.find( startsWith( value ) );

		if ( suggestion ) {
			onSelect( suggestion );
		}

		event.preventDefault();
		event.stopPropagation();
	};

	onChange = ( { target: { value } } ) =>
		value.endsWith( ',' ) // commas should automatically insert the tag
			? this.props.onSelect( value.slice( 0, -1 ) )
			: this.props.onChange( value );

	render() {
		const {
			inputRef,
			value,
			tagNames,
		} = this.props;

		const suggestion = value.length && tagNames.find( startsWith( value ) );

		return (
			<div className="tag-input">
				<input
					ref={ inputRef }
					className="tag-input__entry"
					type="text"
					value={ value }
					onChange={ this.onChange }
					onKeyDown={ this.interceptTabPress }
				/>
				<input
					className="tag-input__suggestion"
					type="text"
					value={ suggestion ? suggestion : '' }
				/>
			</div>
		);
	}
}

export default TagInput;

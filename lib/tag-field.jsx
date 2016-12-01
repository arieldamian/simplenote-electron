import React, { PropTypes } from 'react';
import TagChip from './tag-chip';
import TagInput from './tag-input';
import classNames from 'classnames';
import analytics from './analytics';
import {
	difference,
	invoke,
	union,
} from 'lodash';

export default React.createClass( {

	propTypes: {
		tags: PropTypes.array,
		onUpdateNoteTags: PropTypes.func.isRequired
	},

	getDefaultProps: function() {
		return {
			tags: []
		};
	},

	getInitialState: function() {
		return {
			didJustSelect: false,
			selectedTag: -1,
			tagInput: '',
		};
	},

	componentWillReceiveProps: function( nextProps ) {
		const { selectedTag } = this.state;
		const { tags: prevTags } = this.props;
		const { tags: nextTags } = nextProps;

		// if the tags changed externally, we need
		// to match up the selected index with where
		// the tag has moved in the list

		if (
			-1 === selectedTag || // no tag is selected
			prevTags === nextTags // the tags are identical
		) {
			return;
		}

		this.setState( {
			selectedTag: nextTags.indexOf( prevTags[ selectedTag ] ),
		} );
	},

	componentDidUpdate: function() {
		if ( this.hasSelection() ) {
			this.hiddenTag.focus();
		}
	},

	addTag: function( tags ) {
		const newTags = tags.trim().replace( /\s+/g, ',' ).split( ',' );
		this.props.onUpdateNoteTags( union( this.props.tags, newTags ) );
		this.storeTagInput( '' );
		invoke( this.tagInput, 'focus' );
		analytics.tracks.recordEvent( 'editor_tag_added' );
	},

	onSelectTag: function( tag, index ) {
		const { selectedTag } = this.state;

		// Remove tag if we already have it selected
		if ( selectedTag === index ) {
			return this.deleteTag( index );
		}

		this.setState( {
			didJustSelect: true,
			selectedTag: index,
		} );
	},

	hasSelection: function() {
		return this.state.selectedTag !== -1;
	},

	deleteTag: function( index ) {
		const {
			onUpdateNoteTags,
			tags,
		} = this.props;
		const { selectedTag } = this.state;

		const newTags = difference( tags, [ tags[ selectedTag ] ] );

		onUpdateNoteTags( newTags );

		if ( selectedTag === index ) {
			this.setState( { selectedTag: -1 } );
		}

		invoke( this.tagInput, 'focus' );

		analytics.tracks.recordEvent( 'editor_tag_removed' );
	},

	deleteSelection: function() {
		if ( this.hasSelection() ) {
			this.deleteTag( this.state.selectedTag );

		}
	},

	selectLastTag: function() {
		this.setState( {
			selectedTag: this.props.tags.length - 1
		} );
	},

	onKeyDown: function( e ) {
		// only handle backspace
		if ( 8 !== e.which ) {
			return;
		}

		if ( this.hasSelection() ) {
			this.deleteSelection();
		}

		if ( '' !== this.state.tagInput ) {
			return;
		}

		this.selectLastTag();
		e.preventDefault();
	},

	storeHiddenTag( r ) {
		this.hiddenTag = r;
	},

	storeInputRef( r ) {
		this.tagInput = r;
	},

	storeTagInput( value ) {
		this.setState( {
			tagInput: value,
		} );
	},

	unselect( event ) {
		if ( this.state.didJustSelect ) {
			return this.setState( { didJustSelect: false } );
		}

		if ( this.hiddenTag !== event.relatedTarget ) {
			this.setState( { selectedTag: -1 } );
		}
	},

	render: function() {
		const { selectedTag } = this.state;

		return (
			<div className="tag-entry theme-color-border">
				<div className={classNames( 'tag-editor', { 'has-selection': this.hasSelection() } )}
					tabIndex="-1"
					onKeyDown={this.onKeyDown}
					onBlur={ this.unselect }
				>
					<input className="hidden-tag" tabIndex="-1" ref={ this.storeHiddenTag } />
					{this.props.tags.map( ( tag, index ) =>
						<TagChip
							key={tag}
							tag={tag}
							selected={index === selectedTag}
							onSelect={this.onSelectTag.bind( this, tag, index )}
						/>
					)}
					<div className="tag-field">
						<TagInput
							inputRef={ this.storeInputRef }
							value={ this.state.tagInput }
							onChange={ this.storeTagInput }
							onSelect={ this.addTag }
							tagNames={ this.props.allTags.map( t => t.data.name ) }
						/>
					</div>
				</div>
			</div>
		);
	}

} );

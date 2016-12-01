import React from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

export const TagChip = ( { onSelect = noop, selected, tag: tagName } ) => (
	<div
		className={ classNames( 'tag-chip', { selected } ) }
		onMouseDown={ onSelect }
	>
		{ tagName }
	</div>
);

export default TagChip;

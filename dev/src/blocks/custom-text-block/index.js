import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

registerBlockType( 'myplugin/custom-text', {
	edit( { attributes, setAttributes } ) {
		const { tagName, content, href, target } = attributes;
		const Tag = tagName;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title="設定">
						<SelectControl
							label="HTMLタグを選択"
							value={ tagName }
							options={ [
								{ label: 'p', value: 'p' },
								{ label: 'a', value: 'a' },
								{ label: 'span', value: 'span' },
								{ label: 'div', value: 'div' },
							] }
							onChange={ ( value ) =>
								setAttributes( { tagName: value } )
							}
						/>
						{ tagName === 'a' && (
							<>
								<TextControl
									label="リンク先 (href)"
									value={ href }
									onChange={ ( value ) =>
										setAttributes( { href: value } )
									}
								/>
								<ToggleControl
									label="新しいタブで開く"
									checked={ target === '_blank' }
									onChange={ ( checked ) =>
										setAttributes( {
											target: checked ? '_blank' : '',
										} )
									}
								/>
							</>
						) }
					</PanelBody>
				</InspectorControls>

				<RichText
					tagName={ Tag }
					value={ content }
					onChange={ ( value ) =>
						setAttributes( { content: value } )
					}
					placeholder="ここにテキストを入力"
					{ ...( tagName === 'a' ? { href, target } : {} ) }
					{ ...blockProps }
				/>
			</>
		);
	},

	save( { attributes } ) {
		const { tagName, content, href, target } = attributes;
		const Tag = tagName;
		const blockProps = useBlockProps.save();

		return (
			<RichText.Content
				tagName={ Tag }
				value={ content }
				{ ...( tagName === 'a' ? { href, target } : {} ) }
				{ ...blockProps }
			/>
		);
	},
} );

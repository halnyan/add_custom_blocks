import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, Button } from '@wordpress/components';

import './style.css';

const tagOptions = [
	{ label: 'div', value: 'div' },
	{ label: 'section', value: 'section' },
	{ label: 'article', value: 'article' },
	{ label: 'aside', value: 'aside' },
	{ label: 'main', value: 'main' },
	{ label: 'hgroup', value: 'hgroup' },
	{ label: 'p', value: 'p' },
	{ label: 'a', value: 'a' },
	{ label: 'button', value: 'button' },
	{ label: 'header', value: 'header' },
	{ label: 'footer', value: 'footer' },
	{ label: 'nav', value: 'nav' },
	{ label: 'h1', value: 'h1' },
	{ label: 'h2', value: 'h2' },
	{ label: 'h3', value: 'h3' },
	{ label: 'h4', value: 'h4' },
	{ label: 'h5', value: 'h5' },
	{ label: 'h6', value: 'h6' },
];

registerBlockType( 'myplugin/wrapper-block', {
	icon: {
		src: (
			<svg width="20" height="20" viewBox="0 0 24 24">
				<rect
					x="3"
					y="5"
					width="18"
					height="14"
					fill="none"
					stroke="currentColor"
					rx="1"
				/>
			</svg>
		),
	},

	attributes: {
		tagName: {
			type: 'string',
			default: 'div',
		},
		customClass: {
			type: 'string',
			default: '',
		},
		customId: {
			type: 'string',
			default: '',
		},
		href: {
			type: 'string',
			default: '',
		},
		target: {
			type: 'string',
			default: '',
		},
		customAttributes: {
			type: 'array',
			default: [],
		},
	},

	edit( { attributes, setAttributes } ) {
		const { tagName, customClass, customId, href, target, customAttributes } = attributes;
		const Tag = tagName;

		const blockProps = useBlockProps( {
			className: customClass || undefined,
			id: customId || undefined,
			...(tagName === 'a' && {
				style: {
					pointerEvents: 'none',
					textDecoration: href ? 'underline' : 'none',
					color: href ? '#0073aa' : 'inherit',
				},
				'data-href': href || undefined,
				'data-target': target || undefined,
			}),
			...(tagName === 'button' && {
				onClick: ( event ) => {
					event.preventDefault();
				},
			}),
		} );

		const updateCustomAttribute = ( index, key, value ) => {
			const updatedAttributes = [ ...customAttributes ];
			updatedAttributes[index] = { ...updatedAttributes[index], [key]: value };
			setAttributes( { customAttributes: updatedAttributes } );
		};

		const addCustomAttribute = () => {
			setAttributes( { customAttributes: [ ...customAttributes, { name: '', value: '' } ] } );
		};

		const removeCustomAttribute = ( index ) => {
			const updatedAttributes = customAttributes.filter( ( _, i ) => i !== index );
			setAttributes( { customAttributes: updatedAttributes } );
		};

		return (
			<>
				<InspectorControls>
					<PanelBody title="設定">
						<SelectControl
							label="HTMLタグを選択"
							value={ tagName }
							options={ tagOptions }
							onChange={ ( newTag ) =>
								setAttributes( { tagName: newTag } )
							}
						/>
						<TextControl
							label="id属性"
							value={ customId }
							onChange={ ( val ) =>
								setAttributes( { customId: val } )
							}
							placeholder="例: myId"
						/>
						<TextControl
							label="任意のクラス名"
							value={ customClass }
							onChange={ ( val ) =>
								setAttributes( { customClass: val } )
							}
							placeholder="例: myClass"
						/>
						{ tagName === 'a' && (
							<>
								<TextControl
									label="リンク先URL (href属性)"
									value={ href }
									onChange={ ( val ) =>
										setAttributes( { href: val } )
									}
									placeholder="例: https://example.com"
								/>
								<SelectControl
									label="リンクターゲット (target属性)"
									value={ target }
									options={ [
										{ label: '指定なし', value: '' },
										{ label: '同じウィンドウ (_self)', value: '_self' },
										{ label: '新しいウィンドウ (_blank)', value: '_blank' },
										{ label: '親フレーム (_parent)', value: '_parent' },
										{ label: '最上位フレーム (_top)', value: '_top' },
									] }
									onChange={ ( val ) =>
										setAttributes( { target: val } )
									}
								/>
							</>
						) }
						<PanelBody title="カスタム属性">
							{ customAttributes.map( ( attr, index ) => (
								<div key={ index }>
									<TextControl
										label="属性名"
										value={ attr.name }
										onChange={ ( value ) => updateCustomAttribute( index, 'name', value ) }
									/>
									<TextControl
										label="属性値"
										value={ attr.value }
										onChange={ ( value ) => updateCustomAttribute( index, 'value', value ) }
									/>
									<Button
										isDestructive
										onClick={ () => removeCustomAttribute( index ) }
									>
										削除
									</Button>
								</div>
							) ) }
							<Button isPrimary onClick={ addCustomAttribute }>
								属性を追加
							</Button>
						</PanelBody>
					</PanelBody>
				</InspectorControls>
				<Tag { ...blockProps }>
					<InnerBlocks />
				</Tag>
			</>
		);
	},

	save( { attributes } ) {
		const { tagName, customClass, customId, href, target, customAttributes } = attributes;
		const Tag = tagName;
		const blockProps = useBlockProps.save( {
			className: customClass || undefined,
			id: customId || undefined,
			...(tagName === 'a' && {
				href: href || undefined,
				target: target || undefined,
			}),
		} );

		const additionalAttributes = customAttributes.reduce( ( acc, attr ) => {
			if ( attr.name ) {
				acc[attr.name] = attr.value || undefined;
			}
			return acc;
		}, {} );

		return (
			<Tag { ...blockProps } { ...additionalAttributes }>
				<InnerBlocks.Content />
			</Tag>
		);
	},
} );

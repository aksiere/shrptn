import { definePreset } from 'unocss'

const PRESET_BREAKPOINTS = {
	sm: '40rem',
	md: '50rem',
	lg: '62rem',
	xl: '75rem',
	xxl: '90rem',
}

const PRESET_DIRECTIONS = {
	t: 'top',
	b: 'bottom',
	l: 'left',
	r: 'right',
	x: 'inline',
	y: 'block'
}

const PRESET_ABBREVIATIONS = {
	'w': 'width',
	'h': 'height',
	'm': 'margin',
	'p': 'padding',
}

const GET_PRESET_WH_ABBREVIATIONS = (type, value) => {
	const a = Object.fromEntries(new Map([
		[`unset`, `unset`],
		[`inherit`, `inherit`],
		[`auto`, `auto`],
		[`fit`, `fit-content`],
		[`max`, `max-content`],
		[`min`, `min-content`],
		[`full`, `100%`],
		[`screen`, `100v${type}`],
		[`sv${type}`, `100sv${type}`],
		[`dv${type}`, `100dv${type}`],
		[`lv${type}`, `100lv${type}`],
	]))

	return a[value]
}

export default definePreset((options) => {
	let breakpoints = options?.theme?.breakpoints || PRESET_BREAKPOINTS

	return {
		name: 'Paeonia',

		rules: [
			// FONTS
			[/^ff-(.*)(!)?$/, ([_, value, important]) => ({ 'font-family': `${value} ${important ? '!important' : ''}` })],
			[/^fs-([\.\d]+|inherit)(!)?$/, ([_, value, important]) => ({ 'font-size': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],
			[/^fw-(100|200|300|400|500|600|700|800|900|inherit)(!)?$/, ([_, value, important]) => ({ 'font-weight': `${value} ${important ? '!important' : ''}` })],

			// LINE-HEIGHT
			[/^lh-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'line-height': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : value === 'auto' ? `auto ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],

			// MAX-WIDTH | MAX-HEIGHT
			[/^maxw-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'max-width': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : value === 'auto' ? `auto ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],
			[/^maxh-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'max-height': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : value === 'auto' ? `auto ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],

			// MIN-WIDTH | MIN-HEIGHT
			[/^minw-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'min-width': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : value === 'auto' ? `auto ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],
			[/^minh-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'min-height': `${value === 'inherit' ? `inherit ${important ? '!important' : ''}` : value === 'auto' ? `auto ${important ? '!important' : ''}` : `${value}rem ${important ? '!important' : ''}`}` })],

			// WIDTH | HEIGHT
			[/^(w|h)-([\.\d]+|auto|fit|max|min|full|screen|dvh|svh|lvh|unset|inherit|[\.\d]+\/[\.\d]+)(!)?$/, ([_, type, value, important]) => {
				let obj = {}

				if (value.includes('/')) {
					const [num1, num2] = value.split('/')
					obj[`${PRESET_ABBREVIATIONS[type]}`] = `calc(${num1 / num2 * 100}%) ${important ? '!important' : ''}`
				} else {
					if (!isNaN(value)) {
						obj[`${PRESET_ABBREVIATIONS[type]}`] = `${value}rem ${important ? '!important' : ''}`
					} else {
						obj[`${PRESET_ABBREVIATIONS[type]}`] = `${GET_PRESET_WH_ABBREVIATIONS(type, value)} ${important ? '!important' : ''}`
					}
				}

				return obj
			}],

			// DISPLAY
			[/^d-(block|inline|inline-block|flex|inline-flex|grid|inline-grid|flow-root|none|contents|table|table-row|list-item|inherit|initial|revert|revert-layer|unset)(!)?$/, ([_, type, important]) => ({ 'display': `${type} ${important ? '!important' : ''}` })],

			// MARGIN | PADDING
			[/^([p|m])([t|b|l|r|x|y])?-(auto|[\.\d]+)(!)?$/, ([_, rule, direction, num, important]) => {
				let obj = {}

				if (direction) {
					obj[`${PRESET_ABBREVIATIONS[rule]}${direction ? '-' + PRESET_DIRECTIONS[direction] : ''}`] = `${num === 'auto' ? `auto ${important ? '!important' : ''}` : `${num}rem ${important ? '!important' : ''}`}`
				} else {
					obj[`${PRESET_ABBREVIATIONS[rule]}`] = `${num === 'auto' ? `auto ${important ? '!important' : ''}` : `${num}rem ${important ? '!important' : ''}`}`
				}

				return obj
			}],

			// GAP
			[/^g-([\.\d]+)(!)?$/, ([_, value, important]) => ({
				'--paeonia-gap-x': `${value}rem`,
				'--paeonia-gap-y': `${value}rem`,
				'column-gap': `${value}rem ${important ? '!important' : ''}`,
				'row-gap': `${value}rem ${important ? '!important' : ''}`,
			})],

			[/^gx-([\.\d]+)(!)?$/, ([_, value, important]) => ({
				'--paeonia-gap-x': `${value}rem`,
				'column-gap': `${value}rem ${important ? '!important' : ''}`,
			})],

			[/^gy-([\.\d]+)(!)?$/, ([_, value, important]) => ({
				'--paeonia-gap-y': `${value}rem`,
				'row-gap': `${value}rem ${important ? '!important' : ''}`,
			})],

			// TEAX-ALIGN, ALIGN-ITEMS | JUSTIFY-ITEMS
			[/^text-(left|center|right|justify)(!)?$/, ([_, value, important]) => ({ 'text-align': `${value} ${important ? '!important' : ''}` })],
			[/^(row|row-reverse|column|column-reverse)(!)?$/, ([_, value, important]) => ({ 'flex-direction': `${value} ${important ? '!important' : ''}` })],
			[/^justify-(start|end|flex-start|flex-end|center|space-between|space-around|space-evenly|stretch)(!)?$/, ([_, value, important]) => ({ 'justify-content': `${value} ${important ? '!important' : ''}` })],
			[/^(align|place)-(start|end|flex-start|flex-end|self-start|self-end|center|stretch)(!)?$/, ([_, rule, value, important]) => {
				let obj = {}

				obj[`${rule}-items`] = `${value} ${important ? '!important' : ''}`

				return obj
			}],

			// FLEX-WRAP
			[/^(nowrap|wrap|wrap-reverse)(!)?$/, ([_, value, important]) => ({ 'flex-wrap': `${value} ${important ? '!important' : ''}` })],

			// FLEX-DIRECTION
			[/^flex-(row|row-reverse|column|column-reverse)(!)?$/, ([_, value, important]) => ({ 'flex-direction': `${value} ${important ? '!important' : ''}` })],

			// FLEX-GROW
			[/^grow-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'flex-grow': `${value} ${important ? '!important' : ''}` })],

			// FLEX-SHRINK
			[/^shrink-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'flex-shrink': `${value} ${important ? '!important' : ''}t` })],

			// FLEX-BASIS
			[/^basis-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'flex-basis': `${value} ${important ? '!important' : ''}` })],

			// FLEX: N/M
			[/^([\.\d]+)\/([\.\d]+)(!)?$/, ([_, num1, num2, important]) => ({
				'box-sizing': `border-box ${important ? '!important' : ''}`,
				'flex': `0 0 auto ${important ? '!important' : ''}`,
				'width': `calc((${num1 / num2 * 100}%) - (var(--paeonia-gap-x, 1rem)) + (var(--paeonia-gap-x, 1rem) / ${num2 / num1})) ${important ? '!important' : ''}`
			})],

			// ORDER
			[/^o-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'order': `${value} ${important ? '!important' : ''}` })],

			// GRID: NxM
			[/^([\.\d]+)x([\.\d]+)(!)?$/, ([_, row, col, important]) => ({
				'grid-row-end': `span ${row} ${important ? '!important' : ''}`,
				'grid-column-end': `span ${col} ${important ? '!important' : ''}`
			})],

			// GRID: Nx
			[/^([\.\d]+)x(!)?$/, ([_, value, important]) => ({
				'grid-template-rows': `repeat(${value}, 1fr) ${important ? '!important' : ''}`
			})],

			// GRID: xM
			[/^x([\.\d]+)(!)?$/, ([_, value, important]) => ({
				'grid-template-columns': `repeat(${value}, 1fr) ${important ? '!important' : ''}`
			})],

			// GRID: @N,M
			[/^@([\.\d]+),([\.\d]+)(!)?$/, ([_, row, col, important]) => ({
				'grid-row-start': `${row} ${important ? '!important' : ''}`,
				'grid-column-start': `${col} ${important ? '!important' : ''}`
			})],

			// BACKGROUND | COLOR
			[/^bg-(#?[\w-]+)(!)?$/, ([_, value, important]) => ({ 'background-color': `${value} ${important ? '!important' : ''}` })],
			[/^tx-(#?[\w-]+)(!)?$/, ([_, value, important]) => ({ 'color': `${value} ${important ? '!important' : ''}` })],

			// COLUMNS VANILLA
			[/^columns-([\.\d]+)(!)?$/, ([_, value, important]) => ({ 'columns': `${value} ${important ? '!important' : ''}` })],

			// OBJECT-FIT
			[/^o-fit-([\w-]+)(!)?$/, ([_, value, important]) => ({ 'object-fit': `${value} ${important ? '!important' : ''}` })],

			// TRANSFORM
			[/^tx-(-?[0-9]\d*(\.\d+)?)?$/, ([_, value, important]) => ({ 'transform': `translateX(${value}rem) ${important ? '!important' : ''}` })],
			[/^ty-(-?[0-9]\d*(\.\d+)?)?$/, ([_, value, important]) => ({ 'transform': `translateX(${value}rem) ${important ? '!important' : ''}` })],
		],

		variants: [
			(matcher) => {
				if (!matcher.startsWith('nth')) return matcher

				const modifier = matcher.startsWith('nth-') ? matcher.split('-')[1].split(':')[0] : 'n'
				const l = matcher.startsWith('nth-') ? 4 : 2

				return {
					matcher: matcher.slice(l + modifier.length + 1),
					selector: s => `${s} > *:nth-child(${modifier})`,
				}
			},
			(matcher) => {
				if (!matcher.startsWith('active:')) return matcher

				return {
					matcher: matcher.slice(7),
					selector: s => `${s}:active`,
				}
			},
			(matcher) => {
				if (!matcher.startsWith('hover:')) return matcher

				return {
					matcher: matcher.slice(6),
					selector: s => `${s}:hover`,
				}
			},
			(matcher) => {
				if (!matcher.startsWith('focus:')) return matcher

				return {
					matcher: matcher.slice(6),
					selector: s => `${s}:focus`,
				}
			},
			(matcher) => {
				if (!(Object.keys(breakpoints).map((key) => `${key}:`)).some(item => matcher.startsWith(item))) return matcher

				const breakpoint = matcher.split(':')[0]

				return {
					matcher: matcher.slice(breakpoint.length + 1),
					handle: (input, next) => next({
						...input,
						parent: `${input.parent ? `${input.parent} $$ ` : ''} @media (min-width: ${breakpoints[breakpoint]})`
					}),
				}
			},
		],

		shortcuts: {
			'flex': 'd-flex wrap g-1',
			'grid': 'd-grid x3 g-1',
			'box': 'mw-75 mx-auto',
		},
	}
})

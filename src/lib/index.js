export const GAP = 3

export const doStuff = (links) => {
    let i = 0
    
    for (const link of links) {
        link.offset = sumTitleLength(links, i) * -1
        i++
    }

    return links
}

function sumTitleLength(links, index) {
    let sum = 0
    for (let i = 0; i <= links.length; i++) {
        if (i < index) {
            sum += links[i].title.length + GAP
        }
    }
    return sum
}

export function getTextWidth(text, font) {
	const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
	const context = canvas.getContext('2d')
	context.font = font
	const metrics = context.measureText(text)
	return metrics.width
}

function getCssStyle(element, prop) {
	return window.getComputedStyle(element, null).getPropertyValue(prop)
}

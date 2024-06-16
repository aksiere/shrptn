export const GAP = 3

export const doStuff = (links) => {
    let i = 0
    
    for (const link of links) {
        link.offset = sumTitleLength(links, i) * -1
        i++
    }

    console.log(links)
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

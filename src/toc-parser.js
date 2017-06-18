/**
 * Created by T4rk on 6/15/2017.
 */


const defaultTocBuilderOptions = {
    headings: ['h1', 'h2', 'h3', 'h4', 'h5'],
    callback: (value) => value,
    addId: false
}

export const parseTocDOM = (options=defaultTocBuilderOptions) => {
    const { headings, callback, addId } = {...defaultTocBuilderOptions, ...options}
    const toc = []
    let currentNode
    const nodeIterator = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT,
        (node) => headings.map(h => node.nodeName.toLowerCase().match(h)).reduce((a, e) => a || e) ?
            NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    let nodeCount = 0
    while(currentNode = nodeIterator.nextNode()) {
        nodeCount++
        const nodeInfo = {
            id: `toc-${nodeCount}`,
            content: currentNode.textContent,
            level: headings.indexOf(currentNode.nodeName.toLowerCase()),

        }
        if (addId) {
            const idAttr = document.createAttribute('id')
            nodeInfo.refId = idAttr.value = `toc-ref-${nodeCount}`
            currentNode.attributes.setNamedItem(idAttr)
        }
        toc.push(nodeInfo)
    }
    callback(toc)
}

const defaultMDTocParserOptions = {
    callback: (value) => value
}

export const parseTocMarkdown = (mdString, options=defaultMDTocParserOptions) => {
    const { callback } = {...defaultMDTocParserOptions, ...options}
    const toc = []
    const s = mdString.replace(/```(.*\n|\r)?.*(\n|\r)?```/ig, '')
    const re = /(#+)\s(.*)(\n|\r)/ig
    let m
    let i = 0
    while (m = re.exec(s)) {
        i++
        const [ _, heading, content ] = m
        toc.push({
            id: `toc-${i}`,
            content,
            level: heading.length - 1
        })
    }
    callback(toc)
    return toc
}

export default {
    parseTocDOM,
    parseTocMarkdown
}

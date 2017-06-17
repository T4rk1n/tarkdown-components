/**
 * Created by T4rk on 6/15/2017.
 * These functions are for regular DOM elements.
 */


export const setElementAttributes = (elem, attributes) => {
    Object.keys(attributes).filter(k => attributes.hasOwnProperty(k))
        .forEach(k => elem.setAttribute(k, attributes[k]))
}

export const getHead = () => document.querySelector('head')

const defaultCreateElementOptions = {
    elementType: 'div',
    attributes: {},
    innerHtml: '',
    onload: () => null
}

export const createElement = (container, elementId, options=defaultCreateElementOptions) => {
    let element = document.getElementById(elementId)
    if (!element) {
        const { elementType, attributes, innerHtml } = {...defaultCreateElementOptions, ...options}
        element = document.createElement(elementType)
        element.id = elementId
        container.appendChild(element)
        setElementAttributes(element, attributes)
        element.onload = onload
        if (innerHtml) element.innerHTML = innerHtml
    }
    return element
}

export const loadStyle = (styleId, cssFile, onload= ()=> null) => createElement(getHead(), styleId, {
    attributes: {
        rel: 'stylesheet',
        type: 'text/css',
        href: cssFile,
        media: 'all',
    },
    elementType: 'link'
})

export const loadScript = (scriptId, src, onload= ()=> null) => createElement(getHead(), scriptId, {
    elementType: 'script',
    attributes: {src, onload}
})

export const disableStyle = (styleId) => {
    setElementAttributes(document.getElementById(styleId), {disabled: 'disabled'})
}

export default {
    setElementAttributes,
    getHead,
    createElement,
    loadStyle,
    loadScript,
    disableStyle
}

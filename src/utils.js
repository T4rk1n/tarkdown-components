/**
 * Created by T4rk on 6/15/2017.
 */

export const mapObjReducer = (m, [k, v]) => {m[k] = v; return m}

/**
 *
 * @param arr {[]}
 * @param mapping {function} - should return a mapping [key, value]
 * @param obj {{}} - you can set on an existing object by providing a value.
 */
export const mapReduceToObj = (arr, mapping, obj={}) => arr.map(mapping).reduce(mapObjReducer, obj)

export const convertStrMapToObject = (ma, obj={}) => Array.from(ma).reduce(mapObjReducer, obj)

/**
 * Chunk an array in chunks of length n
 * @param arr {[]} - original array
 * @param n {int} - length of chunks
 */
export const chunkArray = (arr, n) => arr.map((item, index) => index % n === 0 ? arr.slice(index, index + n) : null)
    .filter(item => item)


const concatStr = (prev, next) => `${prev}${next}`

/**
 * Change the key style from camelCase to dash separated
 * @param key {string}
 */
export const formatStyleKey = (key) => key.split('')
    .map(item => item.charCodeAt() > 96 ? item: `-${item.toLowerCase()}`).reduce(concatStr, '')

/**
 * Serialize a style object to apply to an element on createElement attributes style
 * @param styleObj
 */
export const serializeStyleObj = (styleObj) => Object.keys(styleObj).filter(k => styleObj.hasOwnProperty(k))
    .map(k => `${formatStyleKey(k)}: ${styleObj[k]};`).reduce(concatStr, '')

const defaultResolveOptions = {
    timeout: 200,
    numberOfTry: 10,
    currentTry: 1
}

/**
 * Resolve a variable by timeout.
 * @param variable - usually a global, something like window.% or self.%
 * @param onResolved {function}
 * @param options {{}}
 */
export const resolveVariable = (variable, onResolved, options=defaultResolveOptions) => {
    const { timeout, numberOfTry, currentTry } = {...defaultResolveOptions, ...options}
    if (!variable && currentTry <= numberOfTry) {
        setTimeout(()=>resolveVariable(variable, onResolved, {...options, currentTry: currentTry+1}), timeout)
    } else {
        onResolved()
    }
}

/**
 * Wrap a function into a cancelable promise.
 * @param func {function}
 * @param options {{}}
 * @return {{promise: Promise, cancel: (function())}}
 */
export const promiseWrap = (func, options={rejectNull: false}) => {
    let canceled = false
    const promise = new Promise((resolve, reject) => {
        const {rejectNull} = options
        let result
        try {
            result = func()
        } catch (e) {
            return reject(e)
        }
        if (rejectNull && !result) reject('Expected promise result is null')
        else if (canceled) reject('Promise was canceled')
        else resolve(result)
    })
    return {
        promise,
        cancel() { canceled = true }
    }
}

const defaultFindAllOptions = {
    indexGet: 1, raw: false
}

/**
 * Find all matches in a string.
 * @param str {string}
 * @param re {RegExp}
 * @param options {{}}
 * @return {Array}
 */
export const findAllMatches = (str, re, options=defaultFindAllOptions) => {
    const { indexGet, raw } = {...defaultFindAllOptions, ...options}
    const matches = []
    let m
    while (m = re.exec(str)) {
        matches.push(raw ? m : m[indexGet])
    }
    return matches
}

export const objItems = (obj) => Object.keys(obj).map(k => [k, obj[k]])

export default {
    mapObjReducer,
    mapReduceToObj,
    convertStrMapToObject,
    serializeStyleObj,
    chunkArray,
    formatStyleKey,
    resolveVariable,
    promiseWrap,
    findAllMatches
}

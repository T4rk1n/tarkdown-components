/**
 * Created by T4rk on 6/14/2017.
 */
// eslint-disable-next-line no-unused-vars
import React, { Component, PropTypes } from 'react'
import Remarkable from 'remarkable'
import hljs from 'highlight.js'
import { promiseWrap } from '../utils'
import highlightManager from '../hightlight-manager'

const defaultMDProps = {
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'hljs language-',
    linkify: false,
    typographer: false,
    quotes: '“”‘’',
}

export default class DangerousMarkdown extends Component {
    constructor() {
        super()
        this.state = {
            markdownReady: false,
            rendered: null
        }
        this._md = new Remarkable('full', {
            highlight: (str, lang) => lang && hljs.getLanguage(lang) ?
                (()=> {
                    try{ return hljs.highlight(lang, str).value} catch(err) { return '' }})()
                : (() => {
                    try { return hljs.highlightAuto(str).value } catch(err) { return ''}
                })
        })
        this.renderMarkdown = this.renderMarkdown.bind(this)
        this._renderPromise = null
    }

    componentWillMount() {
        const {  html, breaks, typographer, langPrefix, linkify, quotes } = {...defaultMDProps, ...this.props}
        this._md.set({
            html, breaks, typographer, langPrefix, linkify, quotes
        })
        this.renderMarkdown()
    }

    componentWillUnmount() {
        if (this._renderPromise) this._renderPromise.cancel()
    }

    renderMarkdown() {
        const { mdString } = this.props
        if (this._renderPromise) this._renderPromise.cancel()
        if (mdString) {
            const onComplete = (value) => this.setState({rendered:value})
            const renderer = () => promiseWrap(()=>{
                return this._md.render(mdString)
            })
            const resolver = () => promiseWrap(() => {
                if (highlightManager.ready) {
                    this._renderPromise = renderer()
                    this._renderPromise.promise.then(onComplete)
                } else {
                    setTimeout(resolver, 200)
                }
            })
            this._renderPromise = promiseWrap(() => {
                highlightManager.findAndLoadLanguages(mdString)
                resolver()
            })

        }
    }

    render() {
        const { rendered } = this.state
        //noinspection CheckTagEmptyBody
        return (
            <div>
                {
                    rendered ? <div dangerouslySetInnerHTML={{__html: rendered}} id=""></div> : ''
                }
            </div>
        )
    }
}

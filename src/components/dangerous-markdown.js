/**
 * Created by T4rk on 6/14/2017.
 */
// eslint-disable-next-line no-unused-vars
import React, { Component, PropTypes } from 'react'
import Remarkable from 'remarkable'
import Highlight from 'highlight.js'
import { promiseWrap } from '../utils'
import highlightManager from '../hightlight-manager'

const defaultMDProps = {
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
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
            highlight: (str, lang) => lang && Highlight.getLanguage(lang) ?
                (()=> {
                    try{ return Highlight.highlight(lang, str).value} catch(err) { return '' }})()
                : (() => {
                    try { return Highlight.highlightAuto(str).value } catch(err) { return ''}
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
        if (mdString) {
            this._renderPromise = promiseWrap(() => {
                highlightManager.findAndLoadLanguages(mdString)
                return this._md.render(mdString)
            })
            this._renderPromise.promise.then((value) => this.setState({rendered:value}))
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

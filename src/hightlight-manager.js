/**
 * Created by T4rk on 6/15/2017.
 */
import hljs from 'highlight.js'
import { loadStyle, loadScript, disableStyle, setElementAttributes } from 'tarkjs'
import { findAllMatches, objItems } from 'tarkjs'

/**
 * Manage the loading of highlight.js resources files.
 */
class HighlightManager {
    constructor() {
        this._loadedStyles = {}
        this._loadedLanguages = {}
        this._styleUrls = {}
        this._langUrls = {}
        this._ready = false
        this._loading = false
        this._hljsLoaded = false
        this.highlightVersion = null

        this.enableHighlightStyle = this.enableHighlightStyle.bind(this)
        this.disableHighlightStyle = this.disableHighlightStyle.bind(this)
        this.disableCurrentStyle = this.disableCurrentStyle.bind(this)
        this.loadHighlightStyle = this.loadHighlightStyle.bind(this)

        this.syncLoadedLang()
        this.initCDNLinks()
    }

    enableHighlightStyle(key) {
        setElementAttributes(document.getElementById(key), {disabled: ''})
        this._loadedStyles[key].disabled = false
    }

    disableHighlightStyle(key) {
        disableStyle(key)
        this._loadedStyles[key].disabled = true
    }

    disableCurrentStyle() {
        this.currentlyLoadedHighlightStyles.forEach(this.disableHighlightStyle)
    }

    loadHighlightStyle(styleKey) {
        this.disableCurrentStyle()
        if (styleKey in Object.keys(this._loadedStyles)) {
            this.enableHighlightStyle(styleKey)
            return
        }
        const url = this._styleUrls[styleKey]
        this._loadedStyles[styleKey] = { disabled: false, ready: false }
        loadStyle(styleKey, url, () => {
            this._loadedStyles[styleKey].ready = true
        })
    }

    syncLoadedLang() {
        hljs.listLanguages().forEach(item => this._loadedLanguages[item] = {ready: true})
    }

    /***
     * Add a script with the url of the language key to the head.
     * @param language {string}
     */
    loadLanguage(language) {
        if (this._loadedLanguages[language]) return
        const url = this._langUrls[language]
        if (!url) throw new Error(`language ${language} is not valid.`)
        this._loadedLanguages[language] = { ready: false }
        loadScript(language, url, () => {
            this._loadedLanguages[language].ready = true
        })
    }

    findAllLanguages(str) {
        return findAllMatches(
            str, new RegExp(`\`\`\`(${this.availableLanguage.join('|')})`, 'ig'), {raw: false, indexGet: 1})
    }

    findAndLoadLanguages(str) {
        this.findAllLanguages(str).forEach(item => this.loadLanguage(item))
    }

    loadHighlight(highlightUrl) {
        loadScript('hljs', highlightUrl, ()=> {
            this._hljsLoaded = true
        })
    }

    /**
     * Fetch or get from localStorage the highlight.js file names hosted on cdnjs.
     */
    initCDNLinks() {
        const cachedlinks = window.localStorage.getItem('_hljslinks')
        if (cachedlinks) {
            const { langUrls, styleUrls } = JSON.parse(cachedlinks)
            this._langUrls = langUrls
            this._styleUrls = styleUrls
            this._ready = true
            return
        }

        const cdnjsAPI = 'https://api.cdnjs.com/libraries/highlight.js?fields=version,assets,filename'
        const baseCDN ='https://cdnjs.cloudflare.com/ajax/libs/highlight.js'
        const re = /(languages|styles)\/(.*)?(\.min\.(js|css))/i

        //noinspection JSUnresolvedFunction
        fetch(cdnjsAPI, {mode: 'cors'}).then((value) => value.json().then(v => {
            const { assets, version, filename } = v
            if (!this.highlightVersion) this.highlightVersion = version

            assets.filter(item => item.version === this.highlightVersion)[0].files.map(
                item => re.exec(item)
            ).filter(item => item).forEach(item => {
                const [ full, category, key ] = item
                const url = `${baseCDN}/${version}/${full}`
                if (category === 'languages') {
                    this._langUrls[key] = url
                } else {
                    this._styleUrls[key] = url

                }
            })
            const highlightUrl = `${baseCDN}/${version}/${filename}`
            window.localStorage.setItem('_hljslinks',
                JSON.stringify({langUrls: this._langUrls, styleUrls: this._styleUrls, highlightUrl}))
            this._ready = true
        }))
    }

    get ready() {
        return this._ready &&
            objItems(this._loadedLanguages).map(([_, v]) => v.ready).reduce((p,n)=> p && n, true) &&
                objItems(this._loadedStyles).map(([_, v]) => v.ready).reduce((p,n)=> p && n, true)
    }

    get currentlyLoadedHighlightStyles() {
        return Object.keys(this._loadedStyles).filter(k => this._loadedStyles[k].disabled)
    }

    get availableStyles() {
        return Object.keys(this._styleUrls)
    }

    get availableLanguage() {
        return Object.keys(this._langUrls)
    }
}

const manager = new HighlightManager()

export default manager

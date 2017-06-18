/**
 * Created by T4rk on 6/17/2017.
 */
import React from 'react'
import DangerousMarkdown from './dangerous-markdown'

const defaultContainerStyle = {
    display: 'flex',

}

const defaultMarkdownEditorProps = {
    containerStyleClass: 'markdown-editor',
    containerId: '',
    containerStyle: defaultContainerStyle,
    initialText: ''
}

export default class MarkdownEditor extends React.Component {
    constructor() {
        super()
        this.state = { mdValue: '' }
        this.onChangeMdValue = this.onChangeMdValue.bind(this)
    }

    componentWillMount() {
        const { initialText } = this.props
        this.setState({mdValue: initialText || ''})
    }

    onChangeMdValue(event) {
        const mdValue = event.target.value
        this.setState({mdValue}, ()=> this._renderer.renderMarkdown(mdValue))

    }

    render() {
        const { mdValue } = this.state
        const {
            containerStyleClass, containerId, containerStyle
        } = {...defaultMarkdownEditorProps, ...this.props}
        return (
            <div className={containerStyleClass} id={containerId} style={containerStyle}>
                <div>
                    <textarea
                        name="markdown-editor"
                        id={`markdown-editor-${containerId}`}
                        cols="30" rows="10"
                        value={mdValue}
                        onChange={this.onChangeMdValue}/>
                </div>
                <DangerousMarkdown mdString={mdValue} ref={r => this._renderer = r}/>
            </div>
        )
    }
}

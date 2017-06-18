/**
 * Created by T4rk on 6/17/2017.
 */
import React from 'react'
import DangerousMarkdown from './dangerous-markdown'

const defaultContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around'
}

const defaultMarkdownEditorProps = {
    containerStyleClass: 'markdown-editor',
    containerId: '',
    containerStyle: defaultContainerStyle,
    initialText: '',
    cols: 80,
    rows: 20,
    textareaStyleClass: ''
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
            containerStyleClass, containerId, containerStyle, cols, rows,
            textareaStyle, textareaStyleClass
        } = {...defaultMarkdownEditorProps, ...this.props}
        return (
            <div className={containerStyleClass} id={containerId} style={containerStyle}>
                <textarea
                    name="markdown-editor"
                    className={`${textareaStyleClass} markdown-editor`}
                    style={textareaStyle}
                    id={`markdown-editor-${containerId}`}
                    cols={cols} rows={rows}
                    value={mdValue}
                    onChange={this.onChangeMdValue}/>
                <DangerousMarkdown mdString={mdValue} ref={r => this._renderer = r}/>
            </div>
        )
    }
}

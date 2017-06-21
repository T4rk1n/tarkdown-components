/**
 * Created by T4rk on 6/17/2017.
 */
import React from 'react'
import highlightManager from '../hightlight-manager'

import { capitalize } from 'tarkjs'

const defaultStyleSelectorProps = {
    containerStyleClass: '', selectStyleClass: '', formatValue: (value) => capitalize(value),
    onChange: () => null
}

export default class HighlightStyleSelector extends React.Component {
    constructor() {
        super()
        this.state = {
            ...this.state,
            highlightReady: false,
            highlightStyle: ''
        }
        this.onChangeStyle = this.onChangeStyle.bind(this)
        this.componentWillMount = this.componentWillMount.bind(this)
    }

    componentWillMount() {
        const resolve = () => {
            if (highlightManager.ready) {
                const enabled = highlightManager.currentlyLoadedHighlightStyles
                this.setState({highlightStyle: enabled.length > 0 ? enabled[0] : this.state.highlightStyle, highlightReady: true})
            } else {
                setTimeout(resolve, 100)
            }
        }
        resolve()
    }

    onChangeStyle(event) {
        const { onChange } = {...defaultStyleSelectorProps, ...this.props}
        const highlightStyle = event.target.value
        this.setState({highlightStyle}, () => {
            highlightManager.loadHighlightStyle(highlightStyle)
            onChange(highlightStyle)
        })
    }

    render() {
        const { highlightReady } = this.state
        if (!highlightReady) return <div></div>
        const {
            containerStyleClass, selectStyleClass, formatValue
        } = {...defaultStyleSelectorProps, ...this.props}
        return (
            <div className={containerStyleClass}>
                <select value={this.state.highlightStyle} className={selectStyleClass} onChange={this.onChangeStyle}>
                    {
                        highlightManager.availableStyles.map(item => (
                            <option key={item} value={item}>{formatValue(item)}</option>
                        ))
                    }
                </select>
            </div>
        )
    }
}

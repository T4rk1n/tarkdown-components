/**
 * Created by T4rk on 6/16/2017.
 */
// eslint-disable-next-line no-unused-vars
import React, { PropTypes, Component } from 'react'

const defaultTOCPropsOptions = {
    containerStyleClass: '', containerId: '', levelMargin: 0.125, contentStyleClass: '', addTocLevelClass: true
}

export default class TableOfContent extends Component {
    render() {
        const { toc, options } = this.props
        const {
            containerStyleClass, containerId, levelMargin,
            addTocLevelClass, contentStyleClass
        } = {...defaultTOCPropsOptions, ...options}

        return (
            <div className={containerStyleClass} id={containerId}>
                {
                    toc.map(item => {
                        const { id, content, level, refId } = item
                        const style = {
                            marginLeft: `${levelMargin * level}rem`
                        }
                        const contentClass = `${contentStyleClass} ${addTocLevelClass ? 'toc-level-' + level : ''}`
                        return (
                            <div key={id} id={id}>
                                { refId ?
                                    <a href={`#${refId}`} style={style} className={contentClass}>{content}</a> :
                                    <div style={style} className={contentClass}>{content}</div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

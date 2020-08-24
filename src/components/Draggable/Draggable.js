import React, { Component } from 'react'
import PropTypes from 'prop-types'

import core from '../../core/core'

import styles from '../../style.css'

class Draggable extends Component {
  constructor(props) {
    super(props)

    this.dragElemRef = React.createRef()
  }

  componentWillReceiveProps(nextProps) {
    // update the state once parent state initialisation is done
    if (this.props.initDone !== nextProps.initDone && nextProps.initDone) {
      this.props.updateState()
    }
  }

  _dragEnd = (e) => {
    e.stopPropagation()

    this.dragElemRef.current.classList.remove(styles.before, styles.after)

    // done dragging, reset dragged element
    core.setDraggedElement(null)
  }

  _dragStart = (e) => {
    e.stopPropagation()

    const {
      id,
      type,
      name,
      fields,
      payload,
      parentID,
      dropzoneID,
      removeElement,
      checkAndRemoveElement
    } = this.props

    const data = {
      id,
      type,
      name,
      payload,
      parentID,
      dropzoneID
    }

    if (fields) {
      data.fields = fields
    }

    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('data', JSON.stringify(data)) // required, we cann't pass JS object

    // if element is already present in some canvas
    // then set draggedElement, so that this will help to remove the element from previous canvas
    if (dropzoneID) {
      core.setDraggedElement({
        elementID: id,
        dropzoneID,
        removeElement,
        checkAndRemoveElement
      })
    }
  }

  /**
   * function to set drop position.
   * first fine mid of element upon which user is dragging over and
   * based on that decide whether user trying to drop an element above or below
   */
  _onDragOver = (e) => {
    const elemCord = this.dragElemRef.current.getBoundingClientRect()
    if (!this.props.spaceAvailable) {
      return false
    }

    if (this.props.allowHorizontal) {
      const dragElemX = e.clientX
      if (dragElemX >= elemCord.x && dragElemX <= elemCord.x + elemCord.width) {
        const midX = elemCord.x + elemCord.width / 2
        if (dragElemX < midX) {
          this.dragElemRef.current.classList.remove(styles.after)
          this.dragElemRef.current.classList.add(styles.before)
          core.setDropPostion(this.props.index)
        } else {
          this.dragElemRef.current.classList.remove(styles.before)
          this.dragElemRef.current.classList.add(styles.after)
          core.setDropPostion(this.props.index + 1)
        }
      }
    } else {
      const dragElemY = e.clientY
      if (
        dragElemY >= elemCord.y &&
        dragElemY <= elemCord.y + elemCord.height
      ) {
        const midY = elemCord.y + elemCord.height / 2
        if (dragElemY < midY) {
          this.dragElemRef.current.classList.remove(styles.after)
          this.dragElemRef.current.classList.add(styles.before)
          core.setDropPostion(this.props.index)
        } else {
          this.dragElemRef.current.classList.remove(styles.before)
          this.dragElemRef.current.classList.add(styles.after)
          core.setDropPostion(this.props.index + 1)
        }
      }
    }

    return true
  }

  _onDragLeave = () => {
    // remove before/after class from dragged element
    this.dragElemRef.current.classList.remove(styles.before, styles.after)
  }

  render() {
    const { elementProps, draggable, allowHorizontal } = this.props
    let e = null

    if (this.props.dropzoneID) {
      // add this required function only if element is dropped in canvas
      e = {
        onDragOver: this._onDragOver,
        onDragLeave: this._onDragLeave
      }
    }

    if (draggable) {
      e = {
        ...e,
        draggable: true
      }
    }

    return (
      <div
        ref={this.dragElemRef}
        className={`${styles['drag-item']} ${
          allowHorizontal ? styles.inline : ''
        }`}
        onDragStart={this._dragStart}
        onDragEnd={this._dragEnd}
        {...elementProps}
        {...e}
      >
        {this.props.children}
      </div>
    )
  }
}

Draggable.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  initDone: PropTypes.bool,
  index: PropTypes.number,
  allowHorizontal: PropTypes.bool,
  fields: PropTypes.instanceOf(Array),
  draggable: PropTypes.bool,
  spaceAvailable: PropTypes.bool,
  updateState: PropTypes.func,
  dropzoneID: PropTypes.string,
  parentID: PropTypes.string,
  payload: PropTypes.instanceOf(Object),
  elementProps: PropTypes.instanceOf(Object),
  type: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired,
  removeElement: PropTypes.func,
  checkAndRemoveElement: PropTypes.func
}

Draggable.defaultProps = {
  checkAndRemoveElement: () => true,
  elementProps: null,
  payload: null,
  draggable: true,
  updateState: () => true
}

export default Draggable

// import all components
import Canvas from './components/Canvas/Canvas'
import Dropzone from './components/Dropzone/Dropzone'
import Draggable from './components/Draggable/Draggable'
import Palette from './components/Palette/Palette'
import Trash from './components/Trash/Trash'
import Preview from './components/Preview/Preview'

// import all API's
import state from './core/state'
import core from './core/core'


const registerPaletteElements = core.registerPaletteElements

export {
  Canvas,
  Dropzone,
  Draggable,
  Palette,
  Trash,
  Preview,
  // all open API's
  state,
  core,
  registerPaletteElements
}

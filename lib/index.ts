import TurtleModelViewer from './turtle-model-viewer'
;((w) => {
  w.TurtleModelViewer = TurtleModelViewer
})(window)

declare global {
  interface Window {
    TurtleModelViewer: typeof TurtleModelViewer
  }
}

export { TurtleModelViewer }

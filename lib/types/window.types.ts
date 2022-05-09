export interface WindowAPI {
  /** Sets the iframe height to the given value in pixels or using scrollHeight if value is not passed */
  updateHeight: (height?: number) => void
  /**
   * Listens for DOM changes and updates height when the size changes.
   *
   * When passing absoluteElements true, an infinite loop can happen if elements are always rendered below the height of the window.
   * e.g. transformed elements or absolute elements with negative bottom
   * @param {Object} opts - Options to be passed to auto resize
   * @param {Boolean} opts.absoluteElements - Defines if auto resize should consider absolut elements
   */
  startAutoResizer: ({ absoluteElements }?: { absoluteElements?: boolean }) => void
  /** Stops resizing the iframe automatically. */
  stopAutoResizer: () => void
}

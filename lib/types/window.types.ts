export interface WindowAPI {
  /** Sets the iframe height to the given value in pixels or using scrollHeight if value is not passed */
  updateHeight: (height?: number) => void
  /**
   * Listens for DOM changes and updates height when the size changes.
   * @param {Object} opts - Options to be passed to auto resize
   * @param {Boolean} opts.absoluteElements - Defines if auto resize should consider absolut elements
   */
  startAutoResizer: ({ absoluteElements }?: { absoluteElements?: boolean }) => void
  /** Stops resizing the iframe automatically. */
  stopAutoResizer: () => void
}

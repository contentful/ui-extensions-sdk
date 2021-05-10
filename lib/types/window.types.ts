export interface WindowAPI {
  /** Sets the iframe height to the given value in pixels or using scrollHeight if value is not passed */
  updateHeight: (height?: number) => void
  /** Listens for DOM changes and updates height when the size changes. */
  startAutoResizer: () => void
  /** Stops resizing the iframe automatically. */
  stopAutoResizer: () => void
}

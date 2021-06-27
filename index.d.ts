import * as React from 'react'

/**
 * Photos array item properties (passed into Gallery's photos property)
 */
export type PhotoProps<CustomPhotoProps extends object = {}> = {
  /**
   *  original width of the gallery image (only used for calculating aspect ratio)
   */
  width: number
  /**
   *  original height of the gallery image (only used for calculating aspect ratio)
   */
  height: number
  /**
   * key to be used on component
   */
  key?: string
} & CustomPhotoProps

export interface StonemasonProps<CustomPhotoProps extends object = {}> {
  children: Array<PhotoProps<CustomPhotoProps>>
  /**
   * applies to row layouts only (direction=row)
   * the ideal height of each row or a function which receives the container width
   * and should return the desired ideal height for each row; defaults to 300px
   */
  targetRowHeight?: number | ((containerWidth: number) => number)
  /**
   * applies to row layouts only (direction=row)
   * the maximum amount of neighboring nodes to measure per current node visiting
   * don't change unless you understand the algorithm, see docs
   * defaults to a couple breakpoints
   */
  limitNodeSearch?: number | ((containerWidth: number) => number)

  /**
   * number of margin pixels around each entire image
   */
  margin?: number
}

export type StonemasonI<
  CustomPhotoProps extends object = {}
> = React.ComponentClass<StonemasonProps<CustomPhotoProps>>

declare const Stonemason: StonemasonI

export default Stonemason


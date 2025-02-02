import { findShortestPath } from './utils/dijkstra';
import {cloneElement} from "react";

// compute sizes by creating a graph with rows as edges and photo to break on as nodes
// to calculate the single best layout using Dijkstra's findShortestPat

export const round = (value, decimals) => {
  if (!decimals) decimals = 0;
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

export const ratio = (photo) => {
  return round((photo.width || photo.props.width) / (photo.height || photo.props.height), 2);
}

// get the height for a set of photos in a potential row
export const getCommonHeight = (row, containerWidth, margin) => {
  const rowWidth = containerWidth - row.length * (margin * 2);
  const totalAspectRatio = row.reduce((acc, photo) => acc + ratio(photo), 0);
  return round(rowWidth / totalAspectRatio);
};

export const cost = (row, targetHeight, commonHeight, minHeight, maxHeight) => {
  // overflow will cause max number, which is relatively fine here
  if (maxHeight > 0 && commonHeight > maxHeight) return Math.pow(Math.abs(targetHeight - commonHeight), 3);
  if (minHeight > 0 && commonHeight < minHeight) return Math.pow(Math.abs(targetHeight - commonHeight), 3);
  return Math.pow(Math.abs(targetHeight - commonHeight), 2);
};

// return function that gets the neighboring nodes of node and returns costs
const makeGetNeighbors = (targetHeight, containerWidth, photos, limitNodeSearch, margin, minHeight, maxHeight, maxDeviation) => start => {
  const results = {};
  start = +start;
  results[+start] = 0;
  for (let i = start + 1; i < photos.length + 1; ++i) {
    if (i - start > limitNodeSearch) break;
    const row = photos.slice(start, i);
    const commonHeight = getCommonHeight(row, containerWidth, margin);
    const calculatedCost = cost(row, targetHeight, commonHeight, minHeight, maxHeight);
    const deviation = row.reduce((acc, curr) => acc.height + targetHeight - curr.height) / row.length;
    if (deviation > maxDeviation) continue;
    results[i.toString()] = calculatedCost;
  }
  return results;
};

// guesstimate how many neighboring nodes should be searched based on
// the aspect ratio of the container with images having an avg AR of 1.5
// as the minimum amount of photos per row, plus some nodes
const findIdealNodeSearch = ({ targetRowHeight, containerWidth }) => {
  const rowAR = containerWidth / targetRowHeight;
  return round(rowAR / 1.5) + 8;
};

export const computeRowLayout = ({ containerWidth, limitNodeSearch, targetRowHeight, margin, photos, minHeight, maxHeight, maxDeviation }) => {
  // set how many neighboring nodes the graph will visit
  if (limitNodeSearch === undefined) {
    limitNodeSearch = 2;
    const dpiAdjustedWidth = Math.floor(containerWidth / window.devicePixelRatio);
    if (dpiAdjustedWidth >= 450) {
      limitNodeSearch = findIdealNodeSearch({ containerWidth: dpiAdjustedWidth, targetRowHeight });
    }
  }
  
  // const t = +new Date();
  let getNeighbors = makeGetNeighbors(targetRowHeight, containerWidth, photos, limitNodeSearch, margin, minHeight, maxHeight, maxDeviation);
  let path = findShortestPath(getNeighbors, '0', photos.length);
  path = path.map(node => +node);
  // console.log(`time to find the shortest path: ${(+new Date() - t)} ms`);
  for (let i = 1; i < path.length; ++i) {
    const row = photos.slice(path[i - 1], path[i]);
    const height = getCommonHeight(row, containerWidth, margin);
    for (let j = path[i - 1]; j < path[i]; ++j) {
      const p = photos[j];
      const newWidth = round(height * ratio(p), 1) + 'px'
      const newHeight = round(height, 1) + 'px'
      const newStyle = typeof(margin) === "undefined" ? {width: newWidth, height: newHeight} : {width: newWidth, height: newHeight, margin: margin + 'px'};
      const style = p.style || p.props.style
      const newProps = { ...(p.props || {}), style : { ...style, ...newStyle} }
      photos[j] = cloneElement(photos[j], newProps, ...(p.props.children || []))
    }
  }
  return photos;
};

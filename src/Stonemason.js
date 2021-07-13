import React, { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { computeRowLayout } from './layout';

const Stonemason = function Stonemason(props) {
  const margin = props.margin;
  let limitNodeSearch = props.limitNodeSearch;
  let targetHeight = props.targetRowHeight;
  let minRowHeight = props.minRowHeight;
  let maxRowHeight = props.maxRowHeight;
  const [containerSize, setContainerSize] = useState({width: 0, height: 0});
  const StonemasonEl = useRef(null);
  let photos = props.children;

  useEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver(entries => {
      // only do something if width changes
      const newWidth = Math.floor(entries[0].contentRect.width);
      const newHeight = Math.floor(window.outerHeight);
      if (containerSize.width !== newWidth || containerSize.height !== newHeight) {
        // put in an animation frame to stop "benign errors" from
        // ResizeObserver https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        animationFrameID = window.requestAnimationFrame(() => {
          setContainerSize({width: newWidth, height: newHeight});
        });
      }
    });
    observer.observe(StonemasonEl.current);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameID);
    };
  });

  // no containerWidth until after first render with refs, skip calculations and render nothing
  if (!containerSize.width) return <div ref={StonemasonEl}>&nbsp;</div>;
  // subtract 1 pixel because the browser may round up a pixel
  const width = containerSize.width - 1;
  const height = containerSize.height - 1;
  const StonemasonStyle = { display: 'flex', flexWrap: 'wrap', flexDirection: 'row' };

  // allow user to calculate limitNodeSearch from containerWidth
  if (typeof limitNodeSearch === 'function') {
    limitNodeSearch = limitNodeSearch(width);
  }

  if (typeof targetHeight === 'function') {
    targetHeight = targetHeight(width);
  } else {
    targetHeight = props.allowOOB ? targetHeight : Math.min(targetHeight, height);
  }

  photos = computeRowLayout(
      {
        containerWidth: width,
        limitNodeSearch: limitNodeSearch,
        targetRowHeight: targetHeight,
        margin: margin,
        photos: photos,
        minHeight: minRowHeight,
        maxHeight: maxRowHeight
      });

  return (
    <div className="react-stonemason--Stonemason">
      <div ref={StonemasonEl} style={StonemasonStyle}>
        {photos}
      </div>
    </div>
  );
};

const imagePropType = PropTypes.oneOfType([
    PropTypes.shape({
      key: PropTypes.string,
      props: PropTypes.shape({ width: PropTypes.number.isRequired, height: PropTypes.number.isRequired })
    }),
    PropTypes.shape({
      key: PropTypes.string,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    })
]);

Stonemason.propTypes = {
  children: PropTypes.arrayOf(imagePropType).isRequired,
  targetRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  minRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  maxRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  limitNodeSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  allowOOB: PropTypes.bool,
  margin: PropTypes.number,
};

Stonemason.defaultProps = {
  margin: 2,
  targetRowHeight: 300,
  allowOOB: false,
  minRowHeight: 0,
  maxRowHeight: 0
};
export default Stonemason;

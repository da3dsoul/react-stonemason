import React, { useState, useLayoutEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { computeRowLayout } from './layout';

const Stonemason = function Stonemason({margin, limitNodeSearch, targetRowHeight, children}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const StonemasonEl = useRef(null);
  let photos = children;

  useLayoutEffect(() => {
    let animationFrameID = null;
    const observer = new ResizeObserver(entries => {
      // only do something if width changes
      const newWidth = entries[0].contentRect.width;
      if (containerWidth !== newWidth) {
        // put in an animation frame to stop "benign errors" from
        // ResizeObserver https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
        animationFrameID = window.requestAnimationFrame(() => {
          setContainerWidth(Math.floor(newWidth));
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
  if (!containerWidth) return <div ref={StonemasonEl}>&nbsp;</div>;
  // subtract 1 pixel because the browser may round up a pixel
  const width = containerWidth - 1;
  const StonemasonStyle = { display: 'flex', flexWrap: 'wrap', flexDirection: 'row' };
  photos = computeRowLayout({ containerWidth: width, limitNodeSearch, targetRowHeight, margin, photos });

  return (
    <div className="react-stonemason--Stonemason">
      <div ref={StonemasonEl} style={StonemasonStyle}>
        {photos}
      </div>
    </div>
  );
};

const imagePropType = PropTypes.shape({
  key: PropTypes.string,
  props: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  })
});

Stonemason.propTypes = {
  children: PropTypes.arrayOf(imagePropType).isRequired,
  targetRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  limitNodeSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  margin: PropTypes.number
};

Stonemason.defaultProps = {
  margin: 2,
  targetRowHeight: 300,
};
export default Stonemason;

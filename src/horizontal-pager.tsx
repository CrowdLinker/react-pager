import React, { useState, useEffect } from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { PagerProps } from './pager';

function HorizontalPager({
  children,
  activeIndex: parentIndex, // rename to parentIndex for simple refactor
  onChange: parentOnChange, // rename to parentOnChange for simple refactor
  initialIndex = 0, // default to index 0
  adjacentChildOffset,
  pageSize = 1,
  minIndex = 0,
  maxIndex: parentMax = -1,
  threshold = 0.3,
}: Partial<PagerProps>) {
  // determine if the component is controlled
  // we'll assume that if activeIndex prop is defined then it's being controlled:
  const isControlled = parentIndex !== undefined;

  // create our own internal activeIndex to manage when uncontrolled
  const [_activeIndex, setActiveIndex] = useState(initialIndex);

  // determine which activeIndex number and onChange function we should use in our implementation

  // @ts-ignore
  let activeIndex: number = isControlled ? parentIndex : _activeIndex;

  // @ts-ignore
  let onChange: any = isControlled ? parentOnChange : setActiveIndex;

  const offset = activeIndex !== undefined ? activeIndex * -1 : 0;

  const maxIndex =
    parentMax === -1 ? React.Children.count(children) - 1 : parentMax;

  // dragX will represent the current drag value to animate
  const [{ translateX, dragX }, set] = useSpring(() => ({
    translateX: offset * 100 * pageSize,
    dragX: 0,
  }));

  // this might look a bit strange but it's part of the api for useDrag
  // bind() is a function we'll add to our container div that gives us a bunch of gesture state data
  // think of this as an event listener for gestures

  const bind = useDrag(({ delta, last, vxvy, currentTarget }) => {
    // this is the drag value
    const [x] = delta;

    // the velocity of the drag -- important to track to prevent jank after user releases
    const [vx] = vxvy;


    // we want the value to immediate update w/ a user drag event, not spring to the value
    set({ dragX: x, immediate: true });

    // last is true when the user releases from dragging
    if (last) {
      const absChange = Math.abs(x);

      const target: any = currentTarget as any;

      // user has dragged beyond our threshold to transition (either left or right)
      const containerWidth =
        target && target.clientWidth ? target.clientWidth : 0;

      const dragThreshold = containerWidth * threshold * pageSize;

      const indexChange = Math.round(absChange / (containerWidth * pageSize));

      const shouldTransition = absChange >= dragThreshold;

      if (!shouldTransition) {
        // restore to initial position when user started dragging:
        set({ dragX: 0, immediate: false });
      } else {
        // determine the next position based on the drag value (left or right)
        let nextOffset = offset;

        if (x > dragThreshold) {
          // clamp change to minimum index value
          const clampedMin = Math.max(minIndex, activeIndex - indexChange);

          // offset will be the opposite value of the next index
          nextOffset = -clampedMin;

          // update our controller component w/ the previous index
          onChange(clampedMin);
        }

        if (x < dragThreshold) {
          // clamp change to maximum index value
          const clampedMax = Math.min(maxIndex, activeIndex + indexChange);

          // offset will be the opposite value of the next index
          nextOffset = -clampedMax;

          // update our controller component w/ the next index
          onChange(clampedMax);
        }

        // start spring transition to next position
        // we want to spring the drag value back to 0 as we translate to the next position
        set({
          dragX: 0,
          translateX: nextOffset * 100 * pageSize,
          immediate: false,
          config: {
            velocity: vx,
          },
        });
      }
    }
  });

  useEffect(() => {
    set({ translateX: offset * 100 * pageSize, dragX: 0 });
  }, [offset, set, pageSize]);

  // slice our children array and return children adjacent to activeIndex based on adjacentChildOffset prop
  const adjacentChildren =
    adjacentChildOffset !== undefined
      ? children.slice(
          Math.max(activeIndex - adjacentChildOffset, 0),
          Math.min(activeIndex + adjacentChildOffset + 1, children.length)
        )
      : children;

  return (
    <animated.div
      {...bind()}
      style={{ position: 'relative', height: '100%', width: '100%' }}
    >
      <animated.div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          transform: interpolate(
            [translateX, dragX],
            (translateX, dragX) =>
              `translateX(calc(${translateX}% + ${dragX}px))`
          ),
        }}
      >
        {React.Children.map(adjacentChildren, (element, index) => {
          // compute offset of child based on adjacentChildOffset and index
          let offset = index;

          if (adjacentChildOffset !== undefined) {
            offset =
              activeIndex <= adjacentChildOffset
                ? index
                : activeIndex - adjacentChildOffset + index;
          }

          return (
            <animated.div
              style={{
                ...absoluteFill,
                position: 'absolute',
                transform: `translateX(${offset * 100}%)`,
              }}
            >
              {element}
            </animated.div>
          );
        })}
      </animated.div>
    </animated.div>
  );
}

const absoluteFill = {
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
};

export { HorizontalPager };

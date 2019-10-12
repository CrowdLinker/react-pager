import * as React from 'react';
import {
  useSpring,
  animated,
  interpolate,
  to,
  SpringValue,
  SpringUpdateFn,
} from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { GestureConfig } from 'react-use-gesture/dist/types';

// Remove this once this issue is resolved: https://github.com/react-spring/react-spring/issues/613
declare module 'react-spring' {
  export const animated: any;
}

const {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  useMemo,
} = React;

interface PagerProps {
  type: 'horizontal' | 'vertical';
  children: React.ReactNode[];
  activeIndex?: number;
  onChange?: (nextIndex: number) => void;
  initialIndex?: number;
  adjacentChildOffset?: number;
  pageSize?: number;
  minIndex?: number;
  maxIndex?: number;
  threshold?: number;
  clamp: {
    next?: number;
    prev?: number;
  };
  clampDrag: {
    next?: number;
    prev?: number;
  };
  style?: any;
  pageInterpolation: iInterpolationConfig;
  gestureOptions: Partial<GestureConfig>;
}

const BIG_NUMBER = 100000;

function Pager({
  children,
  type = 'horizontal',
  activeIndex: parentIndex, // rename to parentIndex for simple refactor
  onChange: parentOnChange, // rename to parentOnChange for simple refactor
  initialIndex = 0, // default to index 0
  adjacentChildOffset = 10,
  pageSize = 1,
  minIndex = 0,
  maxIndex: parentMax = -1,
  threshold = 0.1,
  clamp = {
    next: BIG_NUMBER,
    prev: BIG_NUMBER,
  },
  clampDrag = {
    next: BIG_NUMBER,
    prev: BIG_NUMBER,
  },
  pageInterpolation = {},
  gestureOptions,
  style,
}: Partial<PagerProps>) {
  if (clamp.next === undefined) {
    clamp.next = BIG_NUMBER;
  }

  if (clamp.prev === undefined) {
    clamp.prev = BIG_NUMBER;
  }

  if (clampDrag.next === undefined) {
    clampDrag.next = BIG_NUMBER;
  }

  if (clampDrag.prev === undefined) {
    clampDrag.prev = BIG_NUMBER;
  }

  // determine if the component is controlled
  // we'll assume that if activeIndex prop is defined then it's being controlled:
  const isControlled = parentIndex !== undefined;

  const pagerContext = useContext(PagerContext);
  const springContext = useContext(SpringContext);

  // create our own internal activeIndex to manage when uncontrolled
  const [_activeIndex, setActiveIndex] = useState(initialIndex);

  // assign props in order of preference: direct prop -> context -> uncontrolled
  let activeIndex = isControlled
    ? parentIndex
    : pagerContext
    ? pagerContext[0]
    : (_activeIndex as any);

  let onChange = isControlled
    ? parentOnChange
    : pagerContext
    ? pagerContext[1]
    : (setActiveIndex as any);

  const maxIndex =
    parentMax === -1 ? React.Children.count(children) - 1 : parentMax;

  const containerRef = useRef<HTMLDivElement | undefined | null>(undefined);

  const targetTransform = type === 'vertical' ? 'translateY' : 'translateX';

  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  useLayoutEffect(() => {
    const { clientWidth = 1, clientHeight = 1 } = containerRef.current as any;
    if (clientWidth !== width) {
      setWidth(clientWidth);
    }

    if (clientHeight !== height) {
      setHeight(clientHeight);
    }
  }, [height, width]);

  const dimension = type === 'vertical' ? height : width;

  let [{ index }, set] = useSpring(() => ({ index: activeIndex }));

  if (springContext) {
    index = springContext[0];
    set = springContext[1];
  }

  let dragStart = 0;
  let swiping = 0;

  const bind = useDrag(({ delta, last }) => {
    // this is the drag value
    const [x, y] = delta;

    const targetDelta = type === 'vertical' ? y : x;

    // first drag frame
    if (swiping === 0) {
      dragStart = index.getValue();
    }

    swiping = 1;

    const deltaPercentage = targetDelta / dimension;
    const clamped = minMax(
      deltaPercentage,
      (clampDrag.next as number) * -1,
      clampDrag.prev as number
    );

    const nextValue = dragStart - clamped;

    set({
      index: nextValue,
      immediate: true,
    });

    // last is true when the user releases from dragging
    if (last) {
      swiping = 0;

      const change = activeIndex - index.getValue();
      const absChange = Math.abs(change);

      let shouldTransition = false;
      let indexChange = 0;
      let nextIndex = activeIndex;

      if (absChange > threshold) {
        shouldTransition = true;
        indexChange = Math.ceil(absChange);

        nextIndex =
          change < 0
            ? Math.min(activeIndex + indexChange, maxIndex)
            : Math.max(activeIndex - indexChange, minIndex);
      }

      set({
        index: nextIndex,
        immediate: false,
      });

      if (shouldTransition) {
        onChange(nextIndex);
      }
    }
  }, gestureOptions);

  useEffect(() => {
    set({
      index: activeIndex,
    });
  }, [activeIndex]);

  // slice our children array and return children adjacent to activeIndex based on adjacentChildOffset prop
  const adjacentChildren =
    adjacentChildOffset !== undefined && children
      ? children.slice(
          Math.max(activeIndex - adjacentChildOffset, 0),
          Math.min(activeIndex + adjacentChildOffset + 1, children.length)
        )
      : children;

  const minimum = useMemo(
    () =>
      interpolate([index], index => {
        // @ts-ignore
        return index - clamp.prev;
      }),
    [clamp.prev, index]
  );

  const maximum = useMemo(
    () =>
      interpolate([index], index => {
        // @ts-ignore
        return index + clamp.next;
      }),
    [clamp.next, index]
  );

  return (
    <animated.div
      {...bind()}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        ...style,
      }}
    >
      <animated.div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          willChange: 'transform',
          transform: interpolate(
            [index],
            index => `${targetTransform}(calc(${index * 100 * pageSize * -1}%))`
          ),
        }}
      >
        <animated.div style={{ display: 'flex', flex: 1 }} ref={containerRef}>
          {React.Children.map(adjacentChildren, (element: any, i: number) => {
            // compute offset of child based on adjacentChildOffset and index
            let position = i;

            if (adjacentChildOffset !== undefined) {
              position =
                activeIndex <= adjacentChildOffset
                  ? i
                  : activeIndex - adjacentChildOffset + i;
            }

            return (
              <IndexProvider index={position}>
                <Page
                  index={position}
                  minimum={minimum}
                  maximum={maximum}
                  pageInterpolation={pageInterpolation}
                  targetTransform={targetTransform}
                >
                  {element}
                </Page>
              </IndexProvider>
            );
          })}
        </animated.div>
      </animated.div>
    </animated.div>
  );
}

interface iPage {
  children: React.ReactNode;
  index: number;
  minimum: SpringValue<number>;
  maximum: SpringValue<number>;
  pageInterpolation: iInterpolationConfig;
  targetTransform: 'translateY' | 'translateX';
}

function _Page({
  children,
  index,
  minimum,
  maximum,
  pageInterpolation,
  targetTransform,
}: iPage) {
  const offset = useOffset();

  const interpolatedStyles = interpolateWithConfig(offset, pageInterpolation);

  // @ts-ignore
  let { zIndex = -index, ...rest } = interpolatedStyles;

  return (
    <animated.div
      style={{
        display: 'flex',
        userSelect: 'none',
        willChange: 'transform',
        ...absoluteFill,
        zIndex: zIndex,
        transform: interpolate([minimum, maximum], (minimum, maximum) => {
          const clamped = minMax(index, minimum, maximum);
          return `${targetTransform}(${clamped * 100}%)`;
        }),
      }}
    >
      <animated.div
        style={{
          display: 'flex',
          ...absoluteFill,
          ...rest,
        }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
}

const Page = React.memo(_Page);

function minMax(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

const absoluteFill: any = {
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  position: 'absolute',
};

type iPagerContext = [number, (next: number) => void];
const PagerContext = React.createContext<undefined | iPagerContext>(undefined);

type iSpringContext = [SpringValue<number>, SpringUpdateFn<{ index: number }>];
const SpringContext = React.createContext<undefined | iSpringContext>(
  undefined
);

interface iPagerProvider {
  children: React.ReactNode;
  initialIndex?: number;
  activeIndex?: number;
  onChange?: (next: number) => void;
}

function PagerProvider({
  children,
  initialIndex = 0,
  activeIndex: parentActiveIndex,
  onChange: parentOnChange,
}: iPagerProvider) {
  const [_activeIndex, _onChange] = useState(initialIndex);

  const isControlled = parentActiveIndex !== undefined;

  const activeIndex = isControlled ? parentActiveIndex : _activeIndex;
  const onChange = isControlled ? parentOnChange : _onChange;

  const [{ index }, set] = useSpring(() => ({ index: activeIndex }));

  const pagerContext = [activeIndex, onChange] as iPagerContext;
  const springContext = [index, set] as iSpringContext;

  return (
    <PagerContext.Provider value={pagerContext}>
      <SpringContext.Provider value={springContext}>
        {children}
      </SpringContext.Provider>
    </PagerContext.Provider>
  );
}

function usePager(): iPagerContext {
  const context = useContext(PagerContext);

  if (context === undefined) {
    throw new Error(`usePager() must be used within a <PagerProvider />`);
  }

  return context;
}

const IndexContext = React.createContext<number | undefined>(undefined);

interface iIndexProvider {
  children: React.ReactNode;
  index: number;
}

function IndexProvider({ children, index }: iIndexProvider) {
  return (
    <IndexContext.Provider value={index}>{children}</IndexContext.Provider>
  );
}

function useIndex(): number {
  const context = useContext(IndexContext);

  if (context === undefined) {
    throw new Error(`useIndex() must be used within an <IndexProvider />`);
  }

  return context;
}

function useFocus() {
  const index = useIndex();
  const [activeIndex] = usePager();

  return index === activeIndex;
}

function useOnFocus(fn: Function) {
  const focused = useFocus();

  useEffect(() => {
    if (focused) {
      fn();
    }
  }, [focused]);
}

function useSpringContext(): iSpringContext {
  const context = useContext(SpringContext);

  if (context === undefined) {
    throw new Error(
      `useSpringContext() must be used within a <SpringProvider />`
    );
  }

  return context;
}

function useOffset() {
  const index = useIndex();
  const [_index] = useSpringContext();

  return _index.interpolate((i: number) => index - i);
}

function useInterpolate(config: iInterpolationConfig) {
  const offset = useOffset();
  const styles = React.useRef(interpolateWithConfig(offset, config)).current;

  return styles;
}

interface InterpolationProp {
  range: number[];
  output: number[];
  extrapolate?: string;
  extrapolateLeft?: string;
  extrapolateRight?: string;
}

interface TransformConfig extends InterpolationProp {
  unit?: string;
}

interface TransformProp {
  [transformProp: string]: TransformConfig;
}

export interface iInterpolationConfig {
  transform?: TransformProp[];
  opacity?: InterpolationProp;
  zIndex?: InterpolationProp;
}

function interpolateWithConfig(
  offset: SpringValue<number>,
  config: iInterpolationConfig
) {
  let style: any = {};
  const keys = Object.keys(config);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // @ts-ignore
    const prop = config[key];

    // e.g tranform: [ {translateX}, {scale} ]
    if (Array.isArray(prop)) {
      let transformProps: string[] = [];
      let transformUnits: string[] = [];

      const result = prop.map(styles => {
        const [transformProp] = Object.keys(styles);
        transformProps.push(transformProp);

        const { unit = '', ...rest } = styles[transformProp];

        transformUnits.push(unit);

        return offset.interpolate(rest);
      });

      const transformStyle = to(result, (...values) =>
        values
          .map((value, index) => {
            return `${transformProps[index]}(${value}${transformUnits[index]})`;
          })
          .join(' ')
      );

      style[key] = transformStyle;
    }
    // e.g opacity: { range, output => -1 -> 0.1}
    else if (typeof prop === 'object') {
      style[key] = offset
        .interpolate(prop)
        // @ts-ignore
        .interpolate(val => `${val}`);
    }
  }

  return style;
}

export {
  Pager,
  PagerProvider,
  usePager,
  useOffset,
  useInterpolate,
  useFocus,
  useOnFocus,
  IndexProvider,
};

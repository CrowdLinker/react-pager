import * as React from 'react';
import {
  iInterpolationConfig,
  IndexProvider,
  useInterpolate,
  useValue,
} from './pager';
import { animated } from 'react-spring';

interface iPagination {
  children: React.ReactNode[];
  pageInterpolation: iInterpolationConfig;
  style?: any;
}

function Pagination({ children, pageInterpolation, style }: iPagination) {
  return (
    <animated.div style={{ flex: 1, display: 'flex', ...style }}>
      {React.Children.map(children, (child: any, index: number) => {
        return (
          <IndexProvider index={index}>
            <PaginationItem pageInterpolation={pageInterpolation}>
              {child}
            </PaginationItem>
          </IndexProvider>
        );
      })}
    </animated.div>
  );
}

interface iPaginationItem {
  children: React.ReactNode;
  pageInterpolation: iInterpolationConfig;
}

function PaginationItem({ children, pageInterpolation }: iPaginationItem) {
  const styles = useInterpolate(pageInterpolation);
  return <animated.div style={{ flex: 1, ...styles }}>{children}</animated.div>;
}

interface iSlider {
  style: any;
  numberOfScreens: number;
}

function Slider({ style, numberOfScreens }: iSlider) {
  const [value] = useValue();

  const width = 100 / numberOfScreens;
  const offset = value.to((index: number) => `translateX(${index * 100}%)`);

  return (
    <animated.div
      style={{
        width: `${width}%`,
        transform: offset,
        height: '100%',
        ...style,
      }}
    />
  );
}

interface iProgress {
  style: any;
  numberOfScreens: number;
}

function Progress({ style, numberOfScreens }: iProgress) {
  const [value] = useValue();
  const width = value.to(index => `${((index + 1) / numberOfScreens) * 100}%`);

  return <animated.div style={{ width, ...style }} />;
}

export { Pagination, Slider, Progress };

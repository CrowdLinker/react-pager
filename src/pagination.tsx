import * as React from 'react';
import { iInterpolationConfig, IndexProvider, useInterpolate } from './pager';
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
  return <animated.div style={styles}>{children}</animated.div>;
}

export { Pagination };

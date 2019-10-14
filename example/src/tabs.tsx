import * as React from 'react';
import {
  Pager,
  Pagination,
  iInterpolationConfig,
  usePager,
  Slider,
  Progress,
  useJumpTo,
} from '../../src';
import { colors } from './shared-components';

const paginationConfig: iInterpolationConfig = {
  transform: [
    {
      scale: {
        range: [-1, 0, 1],
        output: [0.8, 1, 0.8],
        extrapolate: 'clamp',
      },
    },
  ],
};

function Tabs({ children }) {
  const [activeIndex] = usePager();

  const activeColor = colors[activeIndex % colors.length];

  return (
    <>
      <Pager minIndex={-1} style={{ overflow: 'hidden' }}>
        {children}
      </Pager>

      <Progress
        style={{ margin: '5px 0', height: 2, background: activeColor }}
        numberOfScreens={children.length}
      />

      <Pagination pageInterpolation={paginationConfig}>
        {React.Children.map(children, (_, index) => (
          <Circle index={index} />
        ))}
      </Pagination>

      <Slider
        style={{ margin: '5px 0', height: 2, background: activeColor }}
        numberOfScreens={children.length}
      />
    </>
  );
}

function Circle({ index }: { index: number }) {
  const [, onChange] = usePager();
  const jumpTo = useJumpTo();

  return (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
      <button
        onClick={() => jumpTo(index)}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: colors[index % colors.length],
        }}
      ></button>
    </div>
  );
}

export { Tabs };

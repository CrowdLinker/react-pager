import * as React from 'react';
import {
  Pager,
  Pagination,
  iInterpolationConfig,
  usePager,
  Slider,
  Progress,
  useJumpTo,
  iPagerRef,
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

  const pager = React.useRef<iPagerRef | null>(null);
  const activeColor = colors[activeIndex % colors.length];

  function jump(next: number) {
    if (pager.current !== null) {
      pager.current.jumpTo(next);
    }
  }

  return (
    <>
      <Pager style={{ overflow: 'hidden' }} ref={pager}>
        {children}
      </Pager>

      <Progress
        style={{ margin: '5px 0', height: 2, background: activeColor }}
        numberOfScreens={children.length}
      />

      <Pagination pageInterpolation={paginationConfig}>
        {React.Children.map(children, (_, index) => (
          <Circle index={index} jump={jump} />
        ))}
      </Pagination>

      <Slider
        style={{ margin: '5px 0', height: 2, background: activeColor }}
        numberOfScreens={children.length}
      />
    </>
  );
}

function Circle({ index, jump }: { index: number }) {
  const [, onChange] = usePager();

  return (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
      <button
        onClick={() => jump(index)}
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

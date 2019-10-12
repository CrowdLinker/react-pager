import * as React from 'react';
import { Pager, Pagination, iInterpolationConfig, usePager } from '../../src';
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
  return (
    <>
      <Pager style={{ overflow: 'hidden' }}>{children}</Pager>

      <Pagination
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        pageInterpolation={paginationConfig}
      >
        {React.Children.map(children, (_, index) => (
          <Circle index={index} />
        ))}
      </Pagination>
    </>
  );
}

function Circle({ index }: { index: number }) {
  const [, onChange] = usePager();

  return (
    <button
      onClick={() => onChange(index)}
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: colors[index % colors.length],
      }}
    ></button>
  );
}

export { Tabs };

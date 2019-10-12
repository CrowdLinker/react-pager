import * as React from 'react';
import { Pager, iInterpolationConfig } from '../../src';

const stackedCardsConfig: iInterpolationConfig = {
  transform: [
    {
      scale: {
        range: [-1, 0, 1],
        output: [0.8, 1, 0.9],
      },
    },
    {
      translateX: {
        unit: 'px',
        range: [-1, 0, 1, 2],
        output: [-100, 0, 50, 100],
      },
    },
  ],
};

function StackedCards({ children }: any) {
  return (
    <Pager pageInterpolation={stackedCardsConfig} clamp={{ next: 0 }}>
      {children}
    </Pager>
  );
}

export { StackedCards };

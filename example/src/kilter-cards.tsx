import * as React from 'react';

import { Pager, PagerProvider, iInterpolationConfig } from '../../src';

const kilterCardConfig: iInterpolationConfig = {
  transform: [
    {
      scale: {
        range: [-1, 0, 1],
        output: [0.95, 1, 0.95],
      },
    },

    {
      translateY: {
        unit: 'px',
        range: [-1, 0, 1, 2],
        output: [0, 0, 10, -15],
      },
    },

    {
      rotate: {
        unit: 'deg',
        range: [-1, 0, 1, 2],
        output: [-20, 0, -7.5, 5],
      },
    },
  ],

  opacity: {
    range: [-2, -1, 0, 1, 2, 3, 4],
    output: [0, 0, 1, 1, 1, 0, 0],
  },
};

function KilterCards({ children }: any) {
  return (
    <Pager pageInterpolation={kilterCardConfig} clamp={{ next: 0 }}>
      {children}
    </Pager>
  );
}

export { KilterCards };

import * as React from 'react';
import { animated } from 'react-spring';
import { useOnFocus } from '../../src';

export const colors = [
  'aquamarine',
  'coral',
  'gold',
  'cadetblue',
  'crimson',
  'darkorange',
  'darkmagenta',
  'salmon',
];

function Slide({ children, index }) {
  useOnFocus(() => {
    console.log('focused: ', index);
  });

  return (
    <animated.div
      style={{
        background: colors[index % colors.length],
        flex: 1,
        display: 'flex',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px',
      }}
    >
      {children}
    </animated.div>
  );
}

export { Slide };

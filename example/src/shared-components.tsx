import * as React from 'react';
import { animated } from 'react-spring';
import { useOnFocus } from '../../src';

const colors = [
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
      }}
    >
      {children}
    </animated.div>
  );
}

export { Slide };

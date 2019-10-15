import * as React from 'react';

import { Pager, useRoutes } from '../../src';
import { Slide } from './shared-components';

function Routes() {
  const [route, navigate] = useRoutes(['first', 'second', 'third']);

  return (
    <>
      <Pager>
        <Slide index={0}>
          <h1>First</h1>
        </Slide>
        <Slide index={1}>
          <h1>Second</h1>
        </Slide>

        <Slide index={2}>
          <h1>Third</h1>
        </Slide>
      </Pager>
      <div>
        <h3>Active Route: {route}</h3>
        <button onClick={() => navigate('second')}>Go to second</button>
        <button onClick={() => navigate('third')}>Go to third</button>
        <button onClick={() => navigate('first')}>Go to first</button>
      </div>
    </>
  );
}

export { Routes };

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PagerProvider } from '../src';

import { Slide } from './src/shared-components';
import { StackedCards } from './src/stacked-cards';
import { KilterCards } from './src/kilter-cards';
import { Tabs } from './src/tabs';
import { Routes } from './src/routes';

const { useState } = React;

const children = Array.from({ length: 5 }).map((c, i) => (
  <Slide index={i} key={i}>
    <h4 style={{ textAlign: 'center', margin: 0 }}>Index {i}</h4>
  </Slide>
));

function App() {
  const [activeIndex, setActiveIndex] = useState(1);

  function onChange(index: number) {
    setActiveIndex(index);
  }

  return (
    <div style={{ maxWidth: '80vw', margin: '0 auto', padding: 40 }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          margin: '0 auto',
          justifyContent: 'center',
          // overflow: 'hidden',
          padding: 20,
        }}
      >
        <div
          style={{
            height: 200,
            width: 200,
            alignSelf: 'center',
            padding: 10,
          }}
        >
          <PagerProvider activeIndex={activeIndex} onChange={onChange}>
            <Tabs>{children}</Tabs>
          </PagerProvider>
        </div>
      </div>

      <div style={{ margin: 50 }}>
        <h2 style={{ textAlign: 'center' }}>Active Index: {activeIndex}</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 300,
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <button
              style={{
                height: 50,
                width: 100,
                border: 'thin solid black',
                borderRadius: 10,
                background: 'transparent',
              }}
              onClick={() => onChange(activeIndex - 1)}
            >
              {'<'}
            </button>
            <button
              style={{
                height: 50,
                width: 100,
                border: 'thin solid black',
                borderRadius: 10,
                background: 'transparent',
              }}
              onClick={() => onChange(activeIndex + 1)}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

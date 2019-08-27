import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Pager } from '../.';

const { useState } = React;

const PAGE_SIZE = 350;

const children = Array.from({ length: 100000 }).map((c, i) => (
  <h4 key={i} style={{ textAlign: 'center' }}>
    Index {i}
  </h4>
));

// this will represent a consumer component or any part of your application
function App() {
  // all we need to pass are children and an activeIndex prop to our pager component
  const [activeIndex, setActiveIndex] = useState(0);

  function handleChange(index) {
    setActiveIndex(index);
  }

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        margin: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '375px',
          padding: '5px',
          margin: 'auto',
          overflow: 'hidden',
          border: 'thin dotted black',
        }}
      >
        <div
          style={{
            height: 75,
            width: 125,
            border: 'thin dotted black',
            margin: 'auto',
          }}
        >
          <Pager adjacentChildOffset={2} initialIndex={4000}>
            {children}
          </Pager>
        </div>
        <hr />

        <h1 style={{ padding: '0 5px' }}>Browse</h1>
        <hr />

        <div style={{ height: 250, overflow: 'hidden' }}>
          <Pager>
            <FeaturedThumbnail
              title="Pourquoi Julie?"
              subtitle="QUB raido et RECreation"
              color={colors[1]}
              size={150}
            />

            <FeaturedThumbnail
              title="This Is Uncomfortable"
              subtitle="How  money messes with life"
              color={colors[3]}
              size={150}
            />

            <FeaturedThumbnail
              title="Overheard at National Geographic"
              subtitle="Curious stories of a big, beautiful wor..."
              color={colors[2]}
              size={150}
            />
          </Pager>
        </div>

        <hr />

        <h2 style={{ padding: '0 5px' }}>New & Noteworthy</h2>

        <PagerContainer height={PAGE_SIZE}>
          <Pager pageSize={0.5} maxIndex={3} initialIndex={1}>
            <ThumbnailContainer>
              {Array.from({ length: 8 }).map((t, i) => (
                <Thumbnail
                  {...t}
                  size={100}
                  basis={50}
                  color={colors[i % colors.length]}
                />
              ))}
            </ThumbnailContainer>
          </Pager>
        </PagerContainer>

        <hr />

        <h2 style={{ padding: '0 5px' }}>Savor Summer</h2>

        <PagerContainer height={150}>
          <Pager pageSize={0.75} maxIndex={thumbnails.length - 1}>
            <ThumbnailContainer>
              {Array.from({ length: 10 }).map((t, i) => (
                <Thumbnail
                  {...t}
                  size={100}
                  basis={75}
                  color={colors[i % colors.length]}
                />
              ))}
            </ThumbnailContainer>
          </Pager>
        </PagerContainer>

        <hr />

        <h2 style={{ padding: '0 5px' }}>Shows We Love</h2>

        <PagerContainer height={150}>
          <Pager>
            {Array.from({ length: 8 }).map((t, i) => (
              <Thumbnail
                {...t}
                size={100}
                basis={100}
                color={colors[i % colors.length]}
              />
            ))}
          </Pager>
        </PagerContainer>
      </div>
    </div>
  );
}

const THUMBNAIL_SIZE = 150;

function PagerContainer({ children, height }) {
  return (
    <div
      style={{
        height: height,
        display: 'flex',
        margin: 'auto',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function ThumbnailContainer({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}

function FeaturedThumbnail({ color, size }) {
  return (
    <div style={{ flexBasis: '100%', width: '100%' }}>
      <div style={{ padding: '5px' }}>
        <strong style={{ fontSize: 13, color: 'purple', margin: 0 }}>
          FEATURED
        </strong>
        <TextBar width={150} />
        <TextBar width={200} />

        <div
          style={{
            width: '100%',
            height: size,
            background: color,
            borderRadius: '4px',
            marginTop: 15,
          }}
        />
      </div>
    </div>
  );
}

function Thumbnail({ color, size = THUMBNAIL_SIZE, basis = 100 }) {
  return (
    <div
      style={{
        flexBasis: `${basis}%`,
        width: `${basis}%`,
      }}
    >
      <div style={{ padding: '5px' }}>
        <div
          style={{
            width: '100%',
            height: size,
            background: color,
            borderRadius: '4px',
          }}
        />
        <TextBar width={'50%'} />
        <TextBar width={'75%'} />
      </div>
    </div>
  );
}

function TextBar({ width }) {
  return (
    <div
      style={{
        height: 2,
        margin: '15px 0',
        background: 'lightgrey',
        borderRadius: 4,
        width,
      }}
    />
  );
}

const colors = [
  'rgba(124, 124, 124, 1)',
  'rgba(146, 220, 229, 1)',
  'rgba(238, 229, 233, 1)',
  'rgba(214, 73, 51, 1)',
  'rgba(43, 48, 58, 1)',
];

const thumbnails = [
  {
    key: '1',
    title: 'Ear Hustle',
    subtitle: 'Ear Hustle & Radiotopia',
    color: colors[0],
  },
  {
    key: '2',
    title: 'Revisionist History',
    subtitle: 'Pushkin Industries',
    color: colors[1],
  },
  {
    key: '3',
    title: 'The Moment',
    subtitle: 'Wondery',
    color: colors[2],
  },
  {
    key: '4',
    title: 'Pleasure Studies',
    subtitle: 'Feist',
    color: colors[3],
  },
  {
    key: '5',
    title: 'Spectacular Failures',
    subtitle: 'American Public Media',
    color: colors[4],
  },
  {
    key: '6',
    title: '13 Minutes to the Moon',
    subtitle: 'BBC World Service',
    color: colors[0],
  },
  {
    key: '8',
    title: 'Moonrise',
    subtitle: 'Washington Post',
    color: colors[1],
  },
  {
    key: '9',
    title: 'Uncover',
    subtitle: 'CBC Podcasts',
    color: colors[2],
  },
];

ReactDOM.render(<App />, document.getElementById('root'));

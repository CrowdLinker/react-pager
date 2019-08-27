# React Pager

### Example

[CodeSandbox](https://codesandbox.io/s/vigorous-hooks-oopik)

### Install

`yarn add @crowdlinker/react-pager`

### API Reference

```
import { Pager } from '@crowdlinker/react-pager'

interface PagerProps {
  children: React.ReactNode
  activeIndex?: number
  onChange?: (nextIndex: number) => void
  initialIndex?: number
  adjacentChildOffset?: number -- how many adjacent children to activeIndex to render
  pageSize?: number -- [0.0 - 1.0] how far to page for an index change of 1
  minIndex?: number -- minimum clamped value, defaults to 0
  maxIndex?: number -- maximum clamped value, defaults to length of children[]
  threshold?: number -- [0.0 - 1.0] how far to drag until snapping to next index
}

```

import React from 'react'
import { HorizontalPager } from './horizontal-pager'

export interface PagerProps {
  type: 'horizontal' | 'vertical'
  children: any
  activeIndex?: number
  onChange?: (nextIndex: number) => void,
  initialIndex?: number 
  adjacentChildOffset?: number
  pageSize?: number
  minIndex?: number 
  maxIndex?: number
  threshold?: number
}


function Pager({ type = 'horizontal', ...rest }: PagerProps) {
  if (type === 'horizontal') {
    return <HorizontalPager {...rest} />
  }

  return null
}

export { Pager }

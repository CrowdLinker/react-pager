// Remove this once this issue is resolved: https://github.com/react-spring/react-spring/issues/613
declare module 'react-spring' {
  export const animated: any;
}

// @ts-ignore
type SpringValue<T> = any;
type SpringUpdateFn = any;

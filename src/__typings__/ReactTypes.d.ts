export interface ReactContext<T> {
  $$typeof: Symbol | number
  Consumer: ReactContext<T>
  Provider: ReactProviderType<T>

  _calculateChangedBits: ( ( a: T, b: T ) => number ) 

  _currentValue: T
  _currentValue2: T,

  // DEV only
  _currentRenderer?: Object 
  _currentRenderer2?: Object
}

export interface ReactProviderType<T> {
  $$typeof: Symbol | number
  _context: ReactContext<T>
}

export interface RefObject {
  current: any
}
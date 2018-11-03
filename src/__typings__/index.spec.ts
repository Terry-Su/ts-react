import ReactRoot from "../ReactRoot"

export type ReactNode = React$Element

export type React$Element = {
  type: Function | string,
  props: any
}

export type ReactEmpty = null | void | boolean

export type ReactNodeList = ReactEmpty | ReactNode[]

export interface DOMContainer extends HTMLElement {
  _reactRootContainer?: ReactRoot
}


export type React$Component = any

export type Work = {
  then: ( onCommit: () => any ) => void,
  _onCommit: () => void,
  _callbacks: Function[],
  _didCommit: boolean
}

export interface Batch extends FiberRootBatch {
  render: ( children: ReactNodeList ) => Work
  then: ( onComplete: Function ) => void
  commit: () => void


  _root: ReactRoot
  _hasChildren: boolean
  _children: ReactNodeList

  _callbacks: Function[]
  _didComplete: boolean
}

export interface FiberRootBatch {
  _deter: boolean
  _expirationTime: ExpirationTime
  _onComplete: Function
  _next: FiberRootBatch
}

export type ExpirationTime = number


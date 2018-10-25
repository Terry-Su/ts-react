type UserDefinedComponentProps = any 

interface ReactElement {
  type: Function | string,
  props: UserDefinedComponentProps
}

interface ReactDomElement {
  type: string,
  props: UserDefinedComponentProps
}



type UserDefinedFuncComponent = ( props: UserDefinedComponentProps ) => ReactElement

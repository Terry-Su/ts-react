import ReactUserDefinedClassComponent from "../core/ReactUserDefinedClassComponent"

type ReactUserDefinedComponentProps = any 

type ReactUserDefinedFuncComponent = ( props: ReactUserDefinedComponentProps ) => ReactElement

type ReactUserDefinedClassComponentClassType = { new( props: ReactUserDefinedComponentProps ): ReactUserDefinedClassComponent }

type HostComponent = HTMLElement


type ReactElementType = ReactUserDefinedClassComponentClassType | ReactUserDefinedFuncComponent | string

type ReactElementChildren = string | ReactElement | string[] | ReactElement[] 

interface ReactElement {
  type: ReactElementType,
  props: ReactUserDefinedComponentProps
}

interface ReactUserDefinedElement {
  type: ReactUserDefinedFuncComponent | ReactUserDefinedClassComponentClassType,
  props: ReactUserDefinedComponentProps
}
interface ReactDOMElement {
  type: string,
  props: ReactUserDefinedComponentProps
}




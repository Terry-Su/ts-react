import { ReactUserDefinedClassComponent } from "../core/ReactUserDefinedClassComponent";

type ReactUserDefinedComponentProps = any 

type ReactUserDefinedFuncComponent = ( props: ReactUserDefinedComponentProps ) => ReactElement

type ReactUserDefinedClassComponentClassType = { new( props: ReactUserDefinedComponentProps ): ReactUserDefinedClassComponent }

type HostComponent = HTMLElement

interface ReactElement {
  type: ReactUserDefinedClassComponent | ReactUserDefinedFuncComponent | string,
  props: ReactUserDefinedComponentProps
}

interface ReactUserDefinedElement {
  type: ReactUserDefinedFuncComponent | ReactUserDefinedClassComponentClassType,
  props: ReactUserDefinedComponentProps
}
interface ReactDomElement {
  type: string,
  props: ReactUserDefinedComponentProps
}




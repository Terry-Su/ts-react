export default class ReactWork {
  _callbacks: Function[] = []
  _didCommit: boolean = false
  
  then( onCommit: Function ) {
    if ( this._didCommit ) {
      onCommit()
      return
    }

    this._callbacks.push( onCommit )
  }

  _onCommit= () => {
    if ( this._didCommit ) {
      return
    }

    this._didCommit = true
    
    this._callbacks.map( callback => callback() )
  }
}
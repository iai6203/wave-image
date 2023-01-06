import React from 'react'
import cn from 'classnames'
import Scene from './components/Scene'

// ----------------------------------------------------------------------

const App = () => {
  return (
    <>
      <h1
        className={cn(
          'absolute top-1/2 left-1/2 text-white text-8xl whitespace-nowrap -translate-x-1/2 -translate-y-1/2 z-50',
        )}
      >
        POMADA MODELADORA
      </h1>
      <Scene />
    </>
  )
}

export default App

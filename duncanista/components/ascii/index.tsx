// Reference from Threejs
// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii

import { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text3D, useCursor } from '@react-three/drei'
import { AsciiEffect } from 'three-stdlib'

import * as IBMPlexMonoRegular from 'assets/ibm-plex-mono-regular.json'

export const Ascii = () => {
  return (
    <Canvas>
      <MainText />
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <OrbitControls />
      <AsciiRenderer fgColor="white" bgColor="black" />
    </Canvas>
  )
}

const MainText = () => {
  const ref = useRef()
  const [direction, setDirection] = useState(1)
  const [starting, setStarting] = useState(-1)
  useFrame((state, delta) => {
    ref.current.rotation.x += delta/2 * direction
    if (ref.current.rotation.x >= 0.4) {
      setDirection(-direction)
    }

    if (ref.current.rotation.x <= -0.4) {
      setDirection(-direction)
    }
    
    
    
  })
  return (
    <mesh
      ref={ref}
      >
      <Text3D 
        letterSpacing={-0.1}
        size={1}
        position={[-5.5, 0, 0]}
        font={IBMPlexMonoRegular}>
        jordan gonzález
      </Text3D>
    </mesh>
  )
}

function AsciiRenderer({
  renderIndex = 1,
  bgColor = 'black',
  fgColor = 'white',
  characters = ' .:-+*=%@#/<>&%$}',
  invert = true,
  color = false,
  resolution = 0.2
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, { invert, color, resolution })
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, invert, color, resolution])

  // Styling
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor
    effect.domElement.style.backgroundColor = bgColor
  }, [fgColor, bgColor])

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.style.opacity = '0'
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => {
      gl.domElement.style.opacity = '1'
      gl.domElement.parentNode.removeChild(effect.domElement)
    }
  }, [effect])

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera)
  }, renderIndex)

  // This component returns nothing, it is a purely logical
}

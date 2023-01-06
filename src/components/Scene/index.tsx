import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
// @ts-ignore
import glsl from 'babel-plugin-glsl/macro'

// ----------------------------------------------------------------------

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;
    
    uniform float uTime;
  
    varying vec2 vUv;
    varying float vWave;
    
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
    
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;
    
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying float vWave;
  
    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `,
)

extend({ WaveShaderMaterial })

const Wave = () => {
  const ref = useRef()

  const [image] = useLoader(THREE.TextureLoader, [
    'https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
  ])

  useFrame(({ clock }) => {
    if (!ref.current) return

    // @ts-ignore
    ref.current.uTime = clock.getElapsedTime()
  })

  return (
    <mesh>
      <planeGeometry args={[0.4, 0.6, 16, 16]} />
      {/* @ts-ignore */}
      <waveShaderMaterial ref={ref} uColor={'hotpink'} uTexture={image} />
    </mesh>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 12 }}>
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  )
}

export default Scene

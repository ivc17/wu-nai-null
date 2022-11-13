/* eslint-disable react/jsx-no-undef */
import useTexture from 'hooks/useTexture'
import React, { useMemo, useContext } from 'react'
import {
  EquirectangularReflectionMapping,
  Material,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhysicalMaterial
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import matcapURL from '../assets/img/Bentball.png'
// import matcapURL from '../assets/img/matcap8.png'
import normalURL from '../assets/img/roughNormal.jpeg'
import frameURL from '../assets/img/frame.jpeg'

const hdrEquirect = new RGBELoader().load(
  '/royal_esplanade_1k.hdr',
  function () {
    hdrEquirect.mapping = EquirectangularReflectionMapping
    // scene.background = hdrEquirect
  }
)

const fillMaterial = new MeshPhysicalMaterial({
  transmission: 0.6,
  roughness: 0.3,
  reflectivity: 1,
  clearcoat: 1,
  clearcoatRoughness: 1,
  attenuationDistance: 1,
  ior: 1.7,
  // specularIntensity: 1,
  // envMap: hdrEquirect,
  // envMapIntensity: 1,
  color: '#F0F0F0'
})

interface MaterialContextType {
  glassMaterial: Material
  matcapMaterial: Material
  frameMaterial: Material
}

export const MaterialContext = React.createContext<MaterialContextType>({
  glassMaterial: fillMaterial,
  matcapMaterial: fillMaterial,
  frameMaterial: fillMaterial
})

export const MaterialProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const normaltexture = useTexture(normalURL)
  const matcaptexture = useTexture(matcapURL)
  const frameTexture = useTexture(frameURL)

  const glassMaterial = useMemo(() => {
    if (normaltexture) {
      normaltexture.repeat.set(0.005, 0.005)
    }

    const material = new MeshPhysicalMaterial({
      transmission: 0.9,
      roughness: 0.3,
      reflectivity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 1,
      attenuationDistance: 1,
      ior: 1.7,
      specularIntensity: 1,
      normalMap: normaltexture,
      envMap: hdrEquirect,
      envMapIntensity: 1,
      color: '#F3F3F3'
    })

    return material
  }, [normaltexture])

  const frameMaterial = useMemo(() => {
    if (frameTexture) {
      frameTexture.repeat.set(1, 1)
    }

    const material = new MeshPhysicalMaterial({
      transmission: 1,
      roughness: 0.7,
      reflectivity: 1,
      // clearcoat: 1,
      // clearcoatRoughness: 1,
      // attenuationDistance: 1,
      ior: 1.7,
      // specularIntensity: 1,
      normalMap: frameTexture,
      // envMap: hdrEquirect,
      // envMapIntensity: 1,
      color: '#FFFFFF'
    })

    return material
  }, [frameTexture])

  const matcapMaterial = useMemo(() => {
    return new MeshMatcapMaterial({
      matcap: matcaptexture,
      normalMap: normaltexture
    })
  }, [matcaptexture, normaltexture])

  const val = useMemo(() => {
    return { glassMaterial, matcapMaterial, frameMaterial }
  }, [frameMaterial, glassMaterial, matcapMaterial])

  return (
    <MaterialContext.Provider value={val}>{children}</MaterialContext.Provider>
  )
}

export function useMaterial() {
  const context = useContext(MaterialContext)
  return context
}

/* eslint-disable react/jsx-no-undef */
import { getTexture } from 'hooks/useTexture'
import React, { useMemo, useContext } from 'react'
import {
  Color,
  EquirectangularReflectionMapping,
  Material,
  MeshMatcapMaterial,
  MeshPhysicalMaterial
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import matcapURL from '../assets/img/Bentball.png'
// import matcapURL from '../assets/img/matcap8.png'
import normalURL from '../assets/img/roughNormal.jpeg'
import normalURL2 from '../assets/img/normal2.jpeg'
import frameURL from '../assets/img/frame.jpeg'
import * as THREE from 'three'

const hdrEquirect = new RGBELoader().load(
  process.env.PUBLIC_URL + '/skyhdr.hdr',
  function (tex) {
    hdrEquirect.mapping = EquirectangularReflectionMapping
    return tex
  }
)

export const fillMaterial = new MeshPhysicalMaterial({
  transmission: 0.9,
  roughness: 0,
  reflectivity: 0.5,
  clearcoat: 1,
  metalness: 1,
  // clearcoatRoughness: 1,
  // attenuationDistance: 1,
  ior: 2,
  specularIntensity: 1,
  specularColor: new Color('#dedeff'),
  envMap: hdrEquirect,
  envMapIntensity: 1,
  color: '#ffffff',
  transparent: true,
  side: THREE.DoubleSide
})

interface MaterialContextType {
  glassMaterial: Material
  matcapMaterial: Material
  frameMaterial: Material
  hdrEquirect: any
}

export const MaterialContext = React.createContext<MaterialContextType>({
  glassMaterial: fillMaterial,
  matcapMaterial: fillMaterial,
  frameMaterial: fillMaterial,
  hdrEquirect
})

const normaltexture = getTexture(normalURL)
const normaltexture2 = getTexture(normalURL2)
const matcaptexture = getTexture(matcapURL)
const frameTexture = getTexture(frameURL)

export const MaterialProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const glassMaterial = useMemo(() => {
    if (normaltexture) {
      normaltexture.repeat.set(0.005, 0.005)
    }

    if (normaltexture2) {
      normaltexture2.repeat.set(0.005, 0.005)
    }

    const material = new MeshPhysicalMaterial({
      transmission: 0.8,
      roughness: 0.3,
      // reflectivity: 0.5,
      clearcoat: 1,
      metalness: 0,
      // clearcoatRoughness: 1,
      // attenuationDistance: 1,
      ior: 2,
      thickness: 5,
      specularIntensity: 1,
      specularColor: new Color('#000000'),
      normalMap: normaltexture,
      envMap: hdrEquirect,
      envMapIntensity: 0.5,
      color: '#cdcdcd',
      transparent: true,
      side: THREE.DoubleSide
    } as any)

    return material
  }, [])

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
  }, [])

  const matcapMaterial = useMemo(() => {
    return new MeshMatcapMaterial({
      matcap: matcaptexture,
      normalMap: normaltexture
    })
  }, [])

  const val = useMemo(() => {
    return { glassMaterial, matcapMaterial, frameMaterial, hdrEquirect }
  }, [frameMaterial, glassMaterial, matcapMaterial])

  return (
    <MaterialContext.Provider value={val}>{children}</MaterialContext.Provider>
  )
}

export function useMaterial() {
  const context = useContext(MaterialContext)
  return context
}

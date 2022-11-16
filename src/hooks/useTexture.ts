import { useEffect, useState } from "react"
import * as THREE from 'three'

export default function useTexture( url: string ) {
  const [texture, setTexture] = useState<undefined | THREE.Texture>(undefined)
  
  useEffect(()=>{  const loader = new THREE.TextureLoader()
    loader.load(
      url,
    
      // onLoad callback
      function (texture:THREE.Texture) {
        setTexture(texture)
      },
      undefined,
      function (err) {
        console.error('CANNOT LOAD TEXTURE',err)
      }
    )},[url])


  return texture
}

export function getTexture(url:string) {
  const loader = new THREE.TextureLoader()
  
return  loader.load(
    url,
  undefined,
    undefined,
    function (err) {
      console.error('CANNOT LOAD TEXTURE',err)
    }
  )
}

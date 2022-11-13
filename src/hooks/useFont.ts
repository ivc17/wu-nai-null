import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'


const color = 0xff0000;
const matLite = new THREE.MeshBasicMaterial( {
  color: color,
  side: THREE.DoubleSide
} );


export default function useFont(message: string) {
  const [font, setFont]=useState<Font|undefined>(undefined)
  
  useEffect(() => {

    const loader = new FontLoader();
    loader.load(
      '/font/test11.typeface.json',
      function (f) {
        setFont(f)
        },
      undefined,
      (e) => {
    console.log(e)
      }
    )
  },[])

 const text= useMemo(() => {
   if (!font) return undefined

    const shapes = font.generateShapes( message, 100 );

  const geometry = new THREE.ShapeGeometry( shapes );

  geometry.computeBoundingBox();

  if (geometry.boundingBox) {
    const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate( xMid, 0, 0 );
  }

  const text = new THREE.Mesh( geometry, matLite );
  // text.position.z = - 150;
   text.scale.set(-1.5,1.5,1.5)
   text.position.set(0, 0, 0)
   
   return text
},[font, message])

  return text
	
}
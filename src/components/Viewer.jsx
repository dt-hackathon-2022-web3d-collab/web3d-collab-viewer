import './annotations.css';

import { useEffect, useState } from "react";

let THREE;
let raycaster;
let pointer;
const annotations = [];

const Viewer = ({cameraTransform, isFollowing, onOrbitChanged, onAnnotation, isAnnotationsEnabled, userColorHex }) => {
    const [{viewer, context}, setState] = useState({
      context: null, viewer: null,
    });
    
    function onPointerMove( event ) {
      pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function castRayFromCamera () {
      raycaster.setFromCamera( pointer, context.mainCameraComponent._cam );

      const intersects = raycaster.intersectObjects( context.scene.children );

      for ( let i = 0; i < intersects.length; i ++ ) {
         return intersects[ i ].point
      }
    }

    function addAnnotationPoint (target) {
      // Yeah, I know
      const numberCanvas = document.getElementById("number");
      const ctx = numberCanvas.getContext("2d");
      const x = 32;
      const y = 32;
      const radius = 30;
      const startAngle = 0;
      const endAngle = Math.PI * 2;

      ctx.fillStyle = userColorHex || "rgb(0, 0, 0)";
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.fill();

      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.stroke();

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = "32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(annotations.length + 1, x, y);

      let sprite;
      let mesh;
      let spriteBehindObject;
      const annotation = document.querySelector(".annotation");

      const numberTexture = new THREE.CanvasTexture(
        document.querySelector("#number")
      );

      const spriteMaterial = new THREE.SpriteMaterial({
          map: numberTexture,
          alphaTest: 0.5,
          transparent: true,
          depthTest: false,
          depthWrite: false
      });

      sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(target);
      sprite.scale.set(0.08, 0.08, 0.08);

      annotations.push(sprite);
      context.scene.add(sprite);

      const vector = new THREE.Vector3(target);

      vector.project(context.mainCameraComponent._cam);

      vector.x = Math.round((0.5 + vector.x / 2) * (context.renderer.width / window.devicePixelRatio));
      vector.y = Math.round((0.5 - vector.y / 2) * (context.renderer.height / window.devicePixelRatio));

      annotation.style.top = `${vector.y}px`;
      annotation.style.left = `${vector.x}px`;
      annotation.style.opacity = spriteBehindObject ? 0.25 : 1;

      if(onAnnotation) onAnnotation(target);
    }


    useEffect(() => {
      if(!isAnnotationsEnabled) return; 

      const clickListener = viewer.addEventListener('click', () => {
        const intersection = castRayFromCamera();
        if(intersection) addAnnotationPoint(intersection);
      });

      return () => {
        if(!isAnnotationsEnabled && clickListener)
          viewer.removeListener('click', clickListener); 
      }
    }, [isAnnotationsEnabled]);
    

   useEffect(() => {
      init();
   }, []);

   const toggleOrbitControls = (isEnabled) => {
    const orbitControls =  context.mainCameraComponent.gameObject.getComponent('OrbitControls');
    orbitControls.enabled = isEnabled;
   } 

   const updateCameraTransform = () => {
    if(cameraTransform){
      context.mainCameraComponent._cam.position.copy(cameraTransform.position);
      context.mainCameraComponent._cam.rotation.copy(cameraTransform.rotation);
    }
   }

   useEffect(() => {
      if(!context) return;
      toggleOrbitControls(!isFollowing);
   }, [isFollowing, context])

   useEffect(() => {
    if(!context || !isFollowing) return;
    updateCameraTransform(); 
    }, [cameraTransform])
 
    async function init() {
      if(context && viewer) return;
      const viewerDom = document.querySelector("needle-engine");
      setState({ viewer: viewerDom, context: await viewerDom?.getContext() });
    }

    function setupCamera () {
      const orbitControls =  context.mainCameraComponent.gameObject.getComponent('OrbitControls');
      orbitControls.doubleClickToFocus = false;

      orbitControls.controls.addEventListener('change', (change) => {
        if(onOrbitChanged)
        onOrbitChanged({
          position: context.mainCameraComponent._cam.position, 
          rotation: context.mainCameraComponent._cam.rotation,
        });
      });
    }

    function setupRaycaster () {
      raycaster = new THREE.Raycaster();
    }

    function setupListeners () {
      pointer = new THREE.Vector2();
      window.addEventListener( 'pointermove', onPointerMove );
    }

    function setupScene () {
      setupCamera();
      setupRaycaster();
      setupListeners();
    }

    useEffect(() => {
      if(!context) return;
      THREE = context.THREE;
      setupScene();
      console.log(context);
    }, [context])
    
    return (
      <needle-engine>
          <div className="loading"></div>
              <div id="overlay" className="overlay ar desktop">
          </div>
      </needle-engine>
    )
}

export default Viewer;

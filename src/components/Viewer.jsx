import { useEffect, useState } from "react";

let THREE;

const Viewer = ({cameraTransform, isFollowing, onOrbitChanged}) => {
    const [{viewer, context}, setState] = useState({
      context: null, viewer: null,
    });

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
      console.log(viewerDom.context);
    }

    function setupCamera () {
      const orbitControls =  context.mainCameraComponent.gameObject.getComponent('OrbitControls');
      console.log(orbitControls);
      orbitControls.doubleClickToFocus = false;
      orbitControls.middleClickToFocus = false;

      console.log(orbitControls);
      console.log(context.mainCameraComponent)

      orbitControls.controls.addEventListener('change', (change) => {
        if(onOrbitChanged)
        onOrbitChanged({
          position: context.mainCameraComponent._cam.position, 
          rotation: context.mainCameraComponent._cam.rotation,
        });
      });
    }

    function setupScene () {
      setupCamera();
    }

    useEffect(() => {
      if(!context) return;
      console.log(context);
      THREE = context.THREE;
      setupScene();
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
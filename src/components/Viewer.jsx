import { useEffect } from "react";

const Viewer = () => {
    let cartier_api, context, viewer;
    const timeFunctionsByName = {
        setRealtime, setFixedTime, setFastForward
    };

   useEffect(() => {
      setup();
    
      document.addEventListener("DOMContentLoaded", async () => {

      
      });
    
   }, []);

    async function setup() {
      viewer = document.querySelector("needle-engine");
      context = await viewer?.getContext();
      cartier_api = viewer.GameObject.findObjectOfType("CartierViewer");
      viewer.addEventListener("product-selected", onProductChanged);
    }
    
    // window.parent.postMessage(['formaFrameInitialized', '0.0.1'], "*");

    function onProductChanged(evt) {
    }

    async function setRealtime() {
      await setup();
      cartier_api?.setRealtime?.call(cartier_api);
    }

    async function setFixedTime() {
      await setup();
      cartier_api?.setFixedTime?.call(cartier_api);
    }

    async function setFastForward() {
      await setup();
      cartier_api?.setFastForward?.call(cartier_api);
    }

    async function setViewPoint(id) {
      await setup();
      cartier_api?.setViewPoint?.call(cartier_api, id);
    }
    
    return (
      <needle-engine>
          <div className="loading"></div>
              <div id="overlay" className="overlay ar desktop">
          </div>
      </needle-engine>
    )
}

export default Viewer;
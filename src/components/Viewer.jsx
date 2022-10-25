import { useEffect } from "react";

const Viewer = () => {
    let cartier_api, context, viewer;

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

    return (
      <needle-engine>
          <div className="loading"></div>
              <div id="overlay" className="overlay ar desktop">
          </div>
      </needle-engine>
    )
}

export default Viewer;
import { useEffect } from "react";

const Viewer = () => {
    let cartier_api, context, viewer;

   useEffect(() => {
      setup();
   }, []);

    async function setup() {
      try {
        if (viewer && context && cartier_api) return;
        viewer = document.querySelector("needle-engine");
        if(!viewer) return;
        context = await viewer?.getContext();
        if(!context) return;

        console.log({viewer, context})

        cartier_api = viewer.GameObject.findObjectOfType("CartierViewer");
        viewer.removeEventListener("product-selected", onProductChanged);
        viewer.addEventListener("product-selected", onProductChanged);
      }
      catch (err) {
        console.error(err);
        setTimeout(() => {
          setup();
        }, 1000)
      }
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
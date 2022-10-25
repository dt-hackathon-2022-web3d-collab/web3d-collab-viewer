import { useEffect } from "react";

const Viewer = () => {
    let cartier_api, context, viewer;
    const timeFunctionsByName = {
        setRealtime, setFixedTime, setFastForward
    };

   useEffect(() => {
      setup();
    
      window.addEventListener("message", (event) => {
        if (window === event.source) {
          return;
        }
        const {method, args} = event.data;
        switch (method) {
          case 'setViewPoint':
            setViewPoint(args[0]);
            break;
          case 'setWatchFunction':
            timeFunctionsByName[args[0]]();
            break;
          default: break;
        }
      }, false);
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
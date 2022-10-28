import "./annotations.css";

import { useEffect, useState } from "react";

import { LaserTag } from "./LaserTag";
import { useCallback } from "react";
import { useRef } from "react";

let THREE;
let raycaster;
let pointer;
let laserTag;
const annotationPoints = [];

const Viewer = ({
  cameraTransform,
  laser,
  isFollowing,
  onOrbitChanged,
  onLaserChanged,
  isAnnotationsEnabled,
  userColorHex,
  isPointing,
  annotations = [],
  onNewAnnotation,
  newAnnotation,
  onCanceledAnnotation,
}) => {
  const [{ viewer, context }, setState] = useState({
    context: null,
    viewer: null,
  });

  const newAnnotationRef = useRef();

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function castRayFromCamera() {
    raycaster.setFromCamera(pointer, context.mainCameraComponent._cam);

    const intersects = raycaster.intersectObjects(context.scene.children);

    for (let i = 0; i < intersects.length; i++) {
      return intersects[i].point;
    }
  }

  useEffect(() => {
    if (newAnnotationRef.current && !newAnnotation) {
      context.scene.remove(newAnnotationRef.current);
      newAnnotationRef.current = null;
    }
  }, [newAnnotation]);

  const clearAnnotations = () => {
    annotationPoints.forEach((annotationPoint) => {
      context.scene.remove(annotationPoint);
    });
  };

  const setupAnnotations = () => {
    clearAnnotations();
    annotations.forEach((annotation, index) => {
      console.log(index);
      let pos;
      try {
        pos = JSON.parse(annotation.position);
      } catch (e) {
        pos = new THREE.Vector3();
      }

      const ann = addAnnotationPoint(pos, index + 1);
      annotationPoints.push(ann);
    });
  };

  useEffect(() => {
    if (context?.scene && annotations) {
      setupAnnotations();
    }
  }, [annotations, context]);

  useEffect(() => {
    if (!isAnnotationsEnabled) return;

    const listener = () => {
      if (newAnnotationRef.current) return onCanceledAnnotation();

      const intersection = castRayFromCamera();
      if (intersection) {
        newAnnotationRef.current = addAnnotationPoint(
          intersection,
          annotations.length + 1
        );
        onNewAnnotation(intersection);
      }
    };
    viewer.addEventListener("click", listener);

    return () => {
      viewer.removeEventListener("click", listener);
    };
  }, [isAnnotationsEnabled]);

  useEffect(() => {
    init();
  }, []);

  function addAnnotationPoint(target, number) {
    // Yeah, I know
    const numberCanvas = document.createElement("canvas");
    numberCanvas.width = 64;
    numberCanvas.height = 64;

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
    ctx.fillText(number, x, y);

    let sprite;
    let spriteBehindObject;
    const annotation = document.querySelector(".annotation");

    const numberTexture = new THREE.CanvasTexture(numberCanvas);

    const spriteMaterial = new THREE.SpriteMaterial({
      map: numberTexture,
      alphaTest: 0.5,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(target);
    sprite.scale.set(0.08, 0.08, 0.08);

    context.scene.add(sprite);

    const vector = new THREE.Vector3(target);

    vector.project(context.mainCameraComponent._cam);

    vector.x = Math.round(
      (0.5 + vector.x / 2) * (context.renderer.width / window.devicePixelRatio)
    );
    vector.y = Math.round(
      (0.5 - vector.y / 2) * (context.renderer.height / window.devicePixelRatio)
    );

    annotation.style.top = `${vector.y}px`;
    annotation.style.left = `${vector.x}px`;
    annotation.style.opacity = spriteBehindObject ? 0.25 : 1;

    return sprite;
  }

  const toggleOrbitControls = (isEnabled) => {
    const orbitControls =
      context.mainCameraComponent.gameObject.getComponent("OrbitControls");
    orbitControls.enabled = isEnabled;
  };

  const updateCameraTransform = () => {
    if (cameraTransform) {
      context.mainCameraComponent._cam.position.copy(cameraTransform.position);
      context.mainCameraComponent._cam.rotation.copy(cameraTransform.rotation);
    }
  };

  useEffect(() => {
    if (!context) return;
    toggleOrbitControls(!isFollowing);
  }, [isFollowing, context]);

  useEffect(() => {
    if (!context || !isFollowing) return;
    updateCameraTransform();
  }, [cameraTransform]);

  async function init() {
    if (context && viewer) return;
    const viewerDom = document.querySelector("needle-engine");
    setState({ viewer: viewerDom, context: await viewerDom?.getContext() });
  }

  function setupCamera() {
    const orbitControls =
      context.mainCameraComponent.gameObject.getComponent("OrbitControls");
    orbitControls.doubleClickToFocus = false;

    orbitControls.controls.addEventListener("change", (change) => {
      if (onOrbitChanged)
        onOrbitChanged({
          position: context.mainCameraComponent._cam.position,
          rotation: context.mainCameraComponent._cam.rotation,
        });
    });
    laserTag = new LaserTag(context);
    laserTag.color("green");
    laserTag.hide();
  }

  function setupRaycaster() {
    raycaster = new THREE.Raycaster();
  }

  function setupListeners() {
    pointer = new THREE.Vector2();
    window.addEventListener("pointermove", onPointerMove);
  }

  function setupScene() {
    setupCamera();
    setupRaycaster();
    setupListeners();
    context.renderer.setClearColor(0xffffff, 0);
    // set renderer to transparent and use css to set background.
  }

  const pointLaser = useCallback(
    (event) => {
      const camera = context.mainCameraComponent._cam;
      raycaster.setFromCamera(pointer, camera);

      const farPoint = new THREE.Vector3();
      raycaster.ray.at(10, farPoint);
      onLaserChanged({
        from: camera.position,
        to: farPoint,
        color: userColorHex,
      });
    },
    [context, onLaserChanged, isPointing, userColorHex]
  );

  useEffect(() => {
    if (laser === "starting") {
      laserTag?.show();
    } else if (laser === "ending") {
      laserTag?.hide();
    } else {
      laserTag?.point(laser.from, laser.to);
      laserTag?.color(laser.color);
    }
  }, [laser]);

  const [wasPointing, setWasPointing] = useState(false);

  useEffect(() => {
    if (isPointing !== wasPointing) {
      setWasPointing(isPointing);
      toggleOrbitControls(!isPointing);
      if (isPointing) {
        window.addEventListener("pointermove", pointLaser);
        onLaserChanged("starting");
      } else {
        window.removeEventListener("pointermove", pointLaser);
        onLaserChanged("ending");
      }
    }
  }, [isPointing, pointLaser, onLaserChanged, wasPointing, setWasPointing]);

  useEffect(() => {
    if (!context) return;
    THREE = context.THREE;
    setupScene();
  }, [context]);

  return (
    <needle-engine>
      <div className="loading"></div>
      <div id="overlay" className="overlay ar desktop"></div>
    </needle-engine>
  );
};

export default Viewer;

import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { WEBGL } from "three/examples/jsm/WebGL";

// ThreeJS always needs these three
// - Scene, Camera and Render

const scene = new Scene();
const camera = new PerspectiveCamera(
  75, // field view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near
  1000 // far
);

const loader = new GLTFLoader();

/*
  YOU NEED!
  To add the models in the dist and build folder
  in order for it to work.

*/

loader.load(
  "models/scene.gltf",
  function (gltf) {
    console.log(gltf);
    const car = gltf.scene;
    car.scale.set(0.01, 0.01, 0.01);
    scene.add(car);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log(error);
  }
);

// You need light to light up the model
const light = new DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const renderer = new WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
controls.update();

// need for adding to scene
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // lets you drag around
  renderer.render(scene, camera);
}

if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

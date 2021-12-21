import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { WEBGL } from "three/examples/jsm/WebGL";
import { AnimationMixer } from "three";
import { Clock } from "three";

// ThreeJS always needs these three
// - Scene, Camera and Render
let scene, camera, renderer, light, controls;

let mixer;
const clock = new Clock();

function init() {
  scene = new Scene();
  camera = new PerspectiveCamera(
    75, // field view
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near
    1000 // far
  );
  camera.position.z = 5;

  renderer = new WebGLRenderer({ antialias: true });

  // You need light to light up the model
  light = new DirectionalLight(0xffffff, 1);
  light.position.set(2, 2, 5);
  scene.add(light);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const loader = new GLTFLoader();
  loader.load(
    "models/scene.gltf",
    function (gltf) {
      console.log(gltf);
      const model = gltf.scene;
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);

      mixer = new AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();
      animate();
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log(error);
    }
  );
} // init

/*
  YOU NEED!
  To add the models in the dist and build folder
  in order for it to work.

*/

// need for adding to scene
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  mixer.update(delta);
  controls.update(); // lets you drag around
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  init();
  animate();
  window.addEventListener("resize", onWindowResize, false);
} else {
  const warning = WEBGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

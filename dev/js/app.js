var scene, camera, shadowLight, light, backLight, renderer;
var container,
    HEIGHT,
    WIDTH,
    windowHalfX,
    windowHalfY,
    FOV,
    aspectRatio,
    nearPlane,
    farPlane,
    mesh,
    stats,
    composer,
    delta,
    uniforms;
var mouseX = 0, mouseY = 0;
var baseTime = +new Date;
var clock = new THREE.Clock();

window.addEventListener('resize', onWindowResize, false);
window.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();

function init(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x000000, 1);
  document.getElementById('world').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  uniforms = {
    time: { type: 'f', value: 0.1 },
    tex:  { type: 't', value: THREE.ImageUtils.loadTexture( 'images/jacket.jpg') },
    WIDTH: {type: 'f', value: WIDTH},
    HEIGHT: {type: 'f', value: HEIGHT},
    mouseX: {type: 'f', value: mouseX},
    mouseY: {type: 'f', value: mouseY}
  };

  createCamera();
  createJacket();
  createGlitch();
  animate();
}

function createCamera(){
  camera = new THREE.PerspectiveCamera(45, 1000 / 1000, 0.1,10000);
  camera.position.z = 1000;
  scene.add(camera);
}



function createJacket(){
  material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vshader').textContent,
    fragmentShader: document.getElementById('fshader').textContent,
    uniforms: uniforms,
    blending: THREE.AdditiveBlending, transparent: true, depthTest: false
  });
  tobject = new THREE.Mesh( new THREE.PlaneGeometry(1000, 1000 ,1,1), material);
  scene.add(tobject);

}

function createGlitch(){
  var renderPass = new THREE.RenderPass(scene, camera);
  var effectGlitch = new THREE.GlitchPass(1200);
  effectGlitch.renderToScreen = true;

  composer = new THREE.EffectComposer(renderer);
  composer.setSize(WIDTH, HEIGHT);
  composer.addPass(renderPass);
  composer.addPass(effectGlitch);
}

function animate(){
  requestAnimationFrame(animate);
  material.uniforms.time.value = (+new Date - baseTime) / 1000;
  delta = clock.getDelta();
  render();
}

function render(){
  // renderer.render(scene, camera);
  composer.render(delta);
}

function onDocumentMouseMove(event) {
  material.uniforms.mouseX.value = ( event.clientX - windowHalfX ) * 0.15;
  material.uniforms.mouseY.value = ( event.clientY - windowHalfY ) * 0.15;
  console.log('x:'+material.uniforms.mouseX.value + 'y:'+ material.uniforms.mouseY.value);
}

function onWindowResize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.WIDTH.value = WIDTH;
  material.uniforms.HEIGHT.value = HEIGHT;
  scene.remove(tobject);
  createJacket();
}


function $( id ) {
  return document.getElementById( id );
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function createLoadScene() {
  var result = {

    scene:  new THREE.Scene(),
    camera: new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 )

  };

  result.camera.position.z = 100;
  result.scene.add( result.camera );

  var object, geometry, material, light, count = 500, range = 200;

  material = new THREE.MeshLambertMaterial( { color:0xffffff } );
  geometry = new THREE.BoxGeometry( 5, 5, 5 );

  for( var i = 0; i < count; i++ ) {

    object = new THREE.Mesh( geometry, material );

    object.position.x = ( Math.random() - 0.5 ) * range;
    object.position.y = ( Math.random() - 0.5 ) * range;
    object.position.z = ( Math.random() - 0.5 ) * range;

    object.rotation.x = Math.random() * 6;
    object.rotation.y = Math.random() * 6;
    object.rotation.z = Math.random() * 6;

    object.matrixAutoUpdate = false;
    object.updateMatrix();

    result.scene.add( object );

  }

  result.scene.matrixAutoUpdate = false;

  light = new THREE.PointLight( 0xffffff );
  result.scene.add( light );

  light = new THREE.DirectionalLight( 0x111111 );
  light.position.x = 1;
  result.scene.add( light );

  return result;
}

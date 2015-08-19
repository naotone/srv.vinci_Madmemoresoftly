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
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();

var tag = document.createElement('script');
tag.src = 'http://www.youtube.com/player_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var yt_player;
function onYouTubePlayerAPIReady() {
  yt_player = new YT.Player('youtube_player', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange

    }
  });
}

function onPlayerReady() {
  // var timer = setInterval(onPlayerStateChange, 10000)
  document.getElementById('desc').onclick = function() {
      yt_player.playVideo();
  };
  document.getElementById('pause').onclick = function() {
      yt_player.pauseVideo();
  };

}

var myPlayerState;
var playing = false;
function onPlayerStateChange(event) {
  if (event.data == 1) {
  }else{
    requestID = requestAnimationFrame(animate);
    console.log(myPlayerState);
  }
  myPlayerState = event.data;
}




function init(){
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(Math.min(WIDTH, 650), window.innerHeight);
  $('world').style.left = (WIDTH - Math.min(WIDTH, 650)) * 0.5 +'px';
  $('world').style.width = Math.min(WIDTH, 650) + 'px';

  renderer.setClearColor(0x000000, 1);
  $('world').appendChild(renderer.domElement);

  scene = new THREE.Scene();

  uniforms = {
    time: { type: 'f', value: 0.1 },
    tex:  { type: 't', value: THREE.ImageUtils.loadTexture( 'images/jacket.jpg') },
    WIDTH: {type: 'f', value: WIDTH},
    HEIGHT: {type: 'f', value: HEIGHT},
    mouseX: {type: 'f', value: mouseX},
    mouseY: {type: 'f', value: mouseY}
  };
  createStats();

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
  var effectGlitch = new THREE.GlitchPass(8);
  effectGlitch.renderToScreen = true;

  composer = new THREE.EffectComposer(renderer);
  composer.setSize(WIDTH, HEIGHT);
  composer.addPass(renderPass);
  composer.addPass(effectGlitch);
}

function createStats(){
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0';
  stats.domElement.style.right = '0';
  $('world').appendChild(stats.domElement);
}

function animate(){

  requestID = requestAnimationFrame(animate);
  if(myPlayerState == 1 || myPlayerState == 3){
    console.log('pauseeee');
    cancelAnimationFrame(requestID);
    playing = true;
  }

  material.uniforms.time.value = clock.elapsedTime;
  delta = clock.getDelta();
  render();
  stats.update();
}

function render(){
  // renderer.render(scene, camera);
  composer.render(clock.elapsedTime);
}

function onDocumentMouseMove(event) {
  material.uniforms.mouseX.value = ( event.clientX - windowHalfX ) * 0.15;
  material.uniforms.mouseY.value = ( event.clientY - windowHalfY ) * 0.15;
  // console.log('x:'+material.uniforms.mouseX.value + 'y:'+ material.uniforms.mouseY.value);
}

function onWindowResize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  // camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  renderer.setSize(Math.min(WIDTH, 650), window.innerHeight);
  // composer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.WIDTH.value = WIDTH;
  material.uniforms.HEIGHT.value = HEIGHT;
  scene.remove(tobject);
  createJacket();
  $('world').style.left = (WIDTH - Math.min(WIDTH, 650)) * 0.5 +'px';
  $('world').style.width = Math.min(WIDTH, 650) + 'px';
}


function $( id ) {
  return document.getElementById( id );
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

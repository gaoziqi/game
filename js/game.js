var scene = null;//主场景
var camera = null;//主摄像头
var renderer = null;//主渲染
var controls = null;//主摄像头控制
//var clock = new THREE.Clock();//主时钟
var mouse = null;//主鼠标
var phone = null;//主手机
var euler = new THREE.Euler(); // 主手机旋转角
var alpha = [0, 0], beta = [90, 90], gamma = [0, 0];

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 0, 200);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//var light = new THREE.PointLight(0xffffff);
	//light.position.set(0, 250, 0);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(-25, -25, 10);
	directionalLight.name = 'light0';
	scene.add(directionalLight);
	var directionalLight1 = new THREE.DirectionalLight(0xffffff);
	directionalLight1.position.set(25, 25, -10);
	directionalLight1.name = 'light1';
	scene.add(directionalLight1);

	var loader = new THREE.OBJLoader();
	loader.load( 'obj/1.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				//child.material.map = texture;
			}
		});
        console.log(object);
        object.children[0].geometry.computeBoundingBox();
        object.children[0].geometry.center();
		camera.lookAt(object.position);
		phone = object;
		scene.add(phone);
	});

	mouse = new THREE.Vector2();

	controls = new THREE.OrbitControls(camera);
	document.addEventListener('mousemove', function (event) {
		event.preventDefault();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}, false);
	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
	requestAnimationFrame(animate);
	_render();
	_update();
}
function _update() {
	// delta = change in time since last call (in seconds)
	//var delta = clock.getDelta();
    var update = false;
    var change = Math.abs(alpha[1] - alpha[0]) + Math.abs(beta[1] - beta[0]) + Math.abs(gamma[1] - gamma[0]);
    if(change > 5.0 && change < 200.0){
        euler._x = THREE.Math.degToRad(beta[1] - 90)
        euler._y = THREE.Math.degToRad(gamma[1])
        if(-90<beta[1] && beta[1]<= 90){
            euler._z = THREE.Math.degToRad(alpha[1])
        }else{
            euler._z = THREE.Math.degToRad(alpha[1] + 180)
        }
        alpha[0] = alpha[1];
        beta[0] = beta[1];
        gamma[0] = gamma[1];
        update = true;
    }
    if(update === true){
        phone.setRotationFromEuler(euler);
    }
	controls.update();
}

function _render() {
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
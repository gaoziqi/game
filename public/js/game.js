var scene = null;//主场景
var camera = null;//主摄像头
var renderer = null;//主渲染
var controls = null;//主摄像头控制
//var clock = new THREE.Clock();//主时钟
var mouse = null;//主鼠标
var phone = null;//主手机
var euler = new THREE.Euler(); // 主手机旋转角
var yUnit = new THREE.Vector3(0, 1, 0);
var alpha = 0, beta = 0, gamma = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 200);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /*var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-25, -25, 10);
    directionalLight.name = 'light0';
    scene.add(directionalLight);
    var directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(25, 25, -10);
    directionalLight1.name = 'light1';
    scene.add(directionalLight1);*/

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('obj/');
    mtlLoader.load('2.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('obj/');
        objLoader.load('2.obj', function (object) {
            phone = object;
            var t = null;
            phone.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    if (t === null) {
                        t = child.geometry.center();
                    } else {
                        child.geometry.translate(t.x, t.y, t.z);
                    }
                }
            });
            camera.lookAt(phone.position);
            scene.add(phone);
            initLight();
        });
    });

    mouse = new THREE.Vector2();

    controls = new THREE.OrbitControls(camera);
    document.addEventListener('mousemove', function (event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);
    window.addEventListener('resize', onWindowResize, false);
}

function initLight() {
    var spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(0,0,200);
    spotLight.castShadow=true;
    spotLight.target=phone;//光源照射的方向
    spotLight.angle=Math.PI;//光源的角度
    spotLight.shadowCameraNear=2;
    spotLight.shadowCameraFar=20;
    spotLight.shadowCameraVisible=true;
    scene.add(spotLight);
    spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(200,0,0);
    spotLight.castShadow=true;
    spotLight.target=phone;//光源照射的方向
    spotLight.angle=Math.PI;//光源的角度
    spotLight.shadowCameraNear=2;
    spotLight.shadowCameraFar=20;
    spotLight.shadowCameraVisible=true;
    scene.add(spotLight);
    spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(-200,0,0);
    spotLight.castShadow=true;
    spotLight.target=phone;//光源照射的方向
    spotLight.angle=Math.PI;//光源的角度
    spotLight.shadowCameraNear=2;
    spotLight.shadowCameraFar=20;
    spotLight.shadowCameraVisible=true;
    scene.add(spotLight);
}

function animate() {
    requestAnimationFrame(animate);
    _render();
    if (phone !== null) {
        $.ajax({
            type: 'GET',
            async: false,
            url: window.location.href + '/data',
            success: function (data) {
                //var delta = clock.getDelta();
                var change = Math.abs(data.orientation.alpha - alpha) +
                    Math.abs(data.orientation.beta - beta) + Math.abs(data.orientation.gamma - gamma);
                if (change > 5.0 && change < 2000.0) {
                    euler._x = THREE.Math.degToRad(data.orientation.beta);
                    euler._z = THREE.Math.degToRad(-data.orientation.gamma);
                    phone.setRotationFromEuler(euler);
                    if (-90 < beta[1] && beta[1] <= 90) {
                        phone.rotateOnWorldAxis(yUnit, THREE.Math.degToRad(data.orientation.alpha));
                    } else {
                        phone.rotateOnWorldAxis(yUnit, THREE.Math.degToRad(data.orientation.alpha));
                    }
                    alpha = data.orientation.alpha;
                    beta = data.orientation.beta;
                    gamma = data.orientation.gamma;
                }
            }
        });
    }
    _update();
}

function _update() {
    controls.update();
}

function _render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
/**
 * GLOBAL VARS
 */
lastTime = Date.now();
cameras = {
    default: null,
    current: null,
    top: null,
    camaraseguimiento: null
};
canvas = {
    element: null,
    container: null

}
players = {
    p1: null,
    p2: null,
    p3: null
}
labels = {}
cameraControl = null;
scene = null;
renderer = null
acabadotiempo = false;

p1=1;
c1=1;

playerESCO=0;
controlESCO=0; 
var yc = 0;
var xc = -3000;
juega1 = false;
juega2 = false;
juega3 = false;
escogidosJ=[];
collidableLista = [];
gravedadLista = [];
jugadores = [];
explosivoslista = [];
destructibleslist = [];
cameraControl = new THREE.OrbitControls;
keyboard = new THREEx.KeyboardState();
camerasactivada = "";

var modelos = {};

var cargador = {
    loadState: false,
    objsToLoad: 0,
    objsLoaded: 0,
    sceneIsReady: false,
    objLoaded: function (nombre, objeto) {

        modelos[nombre] = objeto;

        this.objsToLoad--;
        this.objsLoaded++;

        var total = this.objsToLoad + this.objsLoaded;
        var porcentaje = (this.objsLoaded / total) * 100;
        console.log(porcentaje);
        if (porcentaje == 100) {
            this.loadState = true;
        }
    },
    addObj: function () {
        this.objsToLoad++;
    }
};

/**
 * Function to start program running a
 * WebGL Application trouhg ThreeJS
 */


let webGLStart = () => {
   
    initScene();
    window.onresize = onWindowResize;
    lastTime = Date.now();
    animateScene();
    
};

/**
 * Here we can setup all our scene noobsters
 */
function initScene() {
   
    //Selecting DOM Elements, the canvas and the parent element.
    canvas.container = document.querySelector("#app");
    canvas.element = canvas.container.querySelector("#appCanvas");
    
    /**
     * SETTING UP CORE THREEJS APP ELEMENTS (Scene, Cameras, Renderer)
     * */
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas: canvas.element });
    renderer.setSize(canvas.container.clientWidth, canvas.container.clientHeight);
    renderer.setClearColor(0x20273a, 1);
    renderer.shadowMapEnabled = true;
    canvas.container.appendChild(renderer.domElement);


    //positioning cameras
    cameras.default = new THREE.PerspectiveCamera(60, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 10000);
    cameras.default.position.set(0, 0, 0);

     var idcam = setInterval(() => {
        if (xc < 2232.984036339939) {
            xc = xc + 7;
        } if (xc > 20) {
            if (yc < 2294.915584220007) {
                yc = yc + 5;
            }
        }
        cameras.default.position.set(xc, yc, -8.250168558042196);
        if (xc > 2232.984036339939 && yc > 2294.915584220007) {
            clearInterval(idcam);
        }
    }, 0.001); 
    //cameras.default.position.set(2232.984036339939,2294.915584220007,-8.250168558042196)

    /*   */
    // camera 2
    carga();
    cameras.current = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.current.position.set(-32, -1, 18);
    scene.add(cameras.current);

    // camera 3
    cameras.up = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.up.position.set(0, 30, 0);
    scene.add(cameras.up);
    // camera 4 (de seguimiento)
    cameras.camaraseguimiento = new THREE.PerspectiveCamera(45, canvas.container.clientWidth / canvas.container.clientHeight, 0.1, 1000);
    cameras.camaraseguimiento.position.set(0, 30, 0);
    scene.add(cameras.camaraseguimiento);

    //Camera control Plugin
    //cameraControl= new THREE.OrbitControls(cameras.current, renderer.domElement);
    cameraControl2 = new THREE.OrbitControls(cameras.default, renderer.domElement);
    //cameraControl3= new THREE.OrbitControls(cameras.up, renderer.domElement);
    //cameraControl4= new THREE.OrbitControls(cameras.camaraseguimiento, renderer.domElement);


    lAmbiente = new THREE.AmbientLight(0xffffff);
    scene.add(lAmbiente);

    spotLight = new THREE.SpotLight(0xf0e7e7, 2);
    spotLight.position.set(0, 3000, 0);
    spotLight.angle = 0.04;
    spotLight.penumbra = 0;
    spotLight.decay = 0;
    spotLight.distance = 3000;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1000;
    spotLight.shadow.mapSize.height = 1000;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;


    spotLight2 = new THREE.SpotLight(0xe12828, 2);
    spotLight2.position.set(10, 3000, 0);
    spotLight2.angle = 0.04;
    spotLight2.penumbra = 0;
    spotLight2.decay = 0;
    spotLight2.distance = 3000;
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1000;
    spotLight2.shadow.mapSize.height = 1000;
    spotLight2.shadow.camera.near = 10;
    spotLight2.shadow.camera.far = 200;


    spotLight3 = new THREE.SpotLight(0x9fd41f, 2);
    spotLight3.position.set(10, 3000, 0);
    spotLight3.angle = 0.04;
    spotLight3.penumbra = 0;
    spotLight3.decay = 0;
    spotLight3.distance = 3000;
    spotLight3.castShadow = true;
    spotLight3.shadow.mapSize.width = 1000;
    spotLight3.shadow.mapSize.height = 1000;
    spotLight3.shadow.camera.near = 10;
    spotLight3.shadow.camera.far = 200;

    bgTexture = new THREE.TextureLoader().load("assets/images/mortal.jpg",
    function (texture) {
        var img = texture.image;
        bgWidth = img.width;
        bgHeight = img.height;
    }
);
scene.background = bgTexture;
bgTexture.wrapS = THREE.MirroredRepeatWrapping;
bgTexture.wrapT = THREE.MirroredRepeatWrapping;
    /*shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
    scene.add( shadowCameraHelper );
*/
    //MATERIAL
    material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('assets/texturas/suelo.jpg'),
        //wireframe: true
    });
   /*  console.log("HORA DE LA VERDAD: "+playerESCO);
    console.log("HORA DE LA VERDAD2: "+controlESCO); */
    
    for(var i=0;i<escogidosJ.length;i++){
        pe1=escogidosJ[i].playerEs;
        ce1=escogidosJ[i].controlEs;
        console.log("jugador: "+pe1+"controles: "+ce1);
        if (pe1 == 1) {
             scene.add(spotLight);
              juega1 = true;
              if (ce1 == 1) {
                  loadObjWithMtl("./assets/objects/", "diablito1.obj", "diablito1.mtl", (obj) => {
                      players.p1 = new Player("P1", obj, new Control("w", "d", "s", "a", "z", "q", "e", false, false, false));
                     // players.p1.seguimientoluz(spotLight);
                      cargador.objLoaded(players.p1.name, obj);
                      players.p1.name = "P1";
                      players.p1.play(scene);
                      jugadores.push(players.p1);
                      players.p1.element.position.set(1200,25,1200);
                  })
              }
              if (ce1 == 2) {
                  loadObjWithMtl("./assets/objects/", "diablito1.obj", "diablito1.mtl", (obj) => {
                      players.p1 = new Player("P1", obj, new Control("t", "h", "g", "f", "v", "r", "y", false, false, false));
                      players.p1.seguimientoluz(spotLight);
                      cargador.objLoaded(players.p1.name, obj);
                      players.p1.name = "P1";
                      players.p1.play();
                      jugadores.push(players.p1);
                      players.p1.element.position.set(1200,25,1200);
                  })
              }
              if (ce1 == 3) {
                  loadObjWithMtl("./assets/objects/", "diablito1.obj", "diablito1.mtl", (obj) => {
                      players.p1 = new Player("P1", obj, new Control("i", "l", "k", "j", "n", "o", "u", false, false, false));
                      players.p1.seguimientoluz(spotLight);
                      cargador.objLoaded(players.p1.name, obj);
                      players.p1.name = "P1";
                      players.p1.play();
                      jugadores.push(players.p1);
                      players.p1.element.position.set(1200,25,1200);
                  })
              }
          }
          if (pe1 == 2) {
              scene.add(spotLight2);
              juega2 = true;
              if (ce1 == 1) {
      
                  loadObjWithMtl("./assets/objects/", "diablito2.obj", "diablito2.mtl", (obj) => {
                      players.p2 = new Player("P2", obj, new Control("w", "d", "s", "a", "z", "q", "e", false, false, false));
                      cargador.objLoaded(players.p2.name, obj);
                      players.p2.name = "P2";
                      players.p2.play(scene);
                      jugadores.push(players.p2);
                      players.p2.element.position.set(1100,25,-1400);
                  })
              }
              if (ce1 == 2) {
      
                  loadObjWithMtl("./assets/objects/", "diablito2.obj", "diablito2.mtl", (obj) => {
                      players.p2 = new Player("P2", obj, new Control("t", "h", "g", "f", "v", "r", "y", false, false, false));
                      cargador.objLoaded(players.p2.name, obj);
                      players.p2.name = "P2";
                      players.p2.play(scene);
                      jugadores.push(players.p2);
                      players.p2.element.position.set(1100,25,-1400);
                  })
              }
              if (ce1 == 3) {
      
                  loadObjWithMtl("./assets/objects/", "diablito2.obj", "diablito2.mtl", (obj) => {
                      players.p2 = new Player("P2", obj, new Control("i", "l", "k", "j", "n", "o", "u", false, false, false));
                      cargador.objLoaded(players.p2.name, obj);
                      players.p2.name = "P2";
                      players.p2.play(scene);
                      jugadores.push(players.p2);
                      players.p2.element.position.set(1100,25,-1400);
                  })
              }
          }
          if (pe1 == 3) {
              scene.add(spotLight3);
              juega3 = true;
              if (ce1 == 1) {
      
                  loadObjWithMtl("./assets/objects/", "diablito3.obj", "diablito3.mtl", (obj) => {
                      players.p3 = new Player("P3", obj, new Control("w", "d", "s", "a", "z", "q", "e", false, false, false));
                      cargador.objLoaded(players.p3.name, obj);
                      players.p3.name = "P3";
                      players.p3.play(scene);
                      jugadores.push(players.p3);
                  })
              }
              if (ce1 == 2) {
      
                  loadObjWithMtl("./assets/objects/", "diablito3.obj", "diablito3.mtl", (obj) => {
                      players.p3 = new Player("P3", obj, new Control("t", "h", "g", "f", "v", "r", "y", false, false, false));
                      cargador.objLoaded(players.p3.name, obj);
                      players.p3.name = "P3";
                      players.p3.play(scene);
                      jugadores.push(players.p3);
                  })
              }
              if (ce1 == 3) {
                  loadObjWithMtl("./assets/objects/", "diablito3.obj", "diablito3.mtl", (obj) => {
                      players.p3 = new Player("P3", obj, new Control("i", "l", "k", "j", "n", "o", "u", false, false, false));
                      cargador.objLoaded(players.p3.name, obj);
                      players.p3.name = "P3";
                      players.p3.play(scene);
                      jugadores.push(players.p3);
                  })
              }
          }

    }
   
    
    //CREACION DE GEOMETRIAS
    // POWERUPS DE VELOCIDAD
    for (var i = 0; i < 20; i++) {
        powerup1 = new powerup(null);
        powerup1.play(scene);

    }
    for (var i = 0; i < 5; i++) {
        powerup2 = new powerupbomba(null);
        powerup2.play();
    }

}


/**
 * Function to add all objects, lights (except for the ambienlight) and stuff to scene
 */
function initObjects() {
    putBombSound = new Sound(["assets/sounds/put.wav"],scene);
   ExplosionSound = new Sound(["assets/sounds/Explosion.mp3"],scene);
   JumpSound = new Sound(["assets/sounds/jump.wav"],scene);
   StartSound = new Sound(["assets/sounds/start.wav"],scene);
   GameStart = new Sound(["assets/sounds/inicio.mp3"],scene);
   GamePlaying = new Sound(["assets/sounds/soundtrack.mp3"],scene);
   Die = new Sound(["assets/sounds/Die.mp3"],scene);
  
    var cont = 0;
    var minutos = 0;
    var crono = setInterval(() => {
        //console.log("minutos: " + minutos + " segundos:" + cont);
       
        if (cont == 59) {
           
            minutos++;
            cont = 0;
        } if (minutos == 1) {
            acabadotiempo = true;

            clearInterval(crono);
        }
        cont++;
    }, 1000);


    var plataforma = new THREE.Mesh(
        new THREE.CubeGeometry(1000, 85, 2800),
        new THREE.MeshPhongMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/arenita.jpg") })
    );

    plataforma.material.map.wrapS = plataforma.material.map.wrapT = THREE.MirroredRepeatWrapping;
    plataforma.receiveShadow = true;
    plataforma.position.set(-1000, 1000, 0);
    scene.add(plataforma);

   
    //COLUMNAS 
    var columna1 = new THREE.Mesh(
        new THREE.BoxGeometry(200, 1400, 300),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/column.png") })
    );
    columna1.position.set(-1400, 260, 1350);
    columna1.receiveShadow = true;
    scene.add(columna1);


    var columna2 = new THREE.Mesh(
        new THREE.BoxGeometry(200, 1400, 300),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/column.png") })
    );
    columna2.position.set(-1400, 260, -1350);
    columna2.receiveShadow = true;
    scene.add(columna2);
    //
    //MUROS DEL BORDE
    var group = new Array();
    //fila fondo
    for (var i = -5; i < 6; i++) {
        var muro1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/lava.jpg") })
        );
        muro1.position.set(-1400, -50, i * -200);
        muro1.receiveShadow = true;
        scene.add(muro1);
        group.push(muro1);

    }
    //fila frente
    for (var i = -7; i < 8; i++) {
        var muro1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/lava.jpg") })
        );
        muro1.position.set(1400, -50, i * -200);
        muro1.receiveShadow = true;
        scene.add(muro1);
        group.push(muro1);

    }
    for (var i = -7; i < 8; i++) {
        var muro2 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/lava.jpg") })
        );
        muro2.position.set(i * -200, -50, 1400);
        muro2.receiveShadow = true;
        scene.add(muro2);
        group.push(muro2);

    }

    //fila derecha
    for (var i = -7; i < 8; i++) {
        var muro2 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/lava.jpg") })
        );
        muro2.position.set(i * -200, -50, -1400);
        muro2.receiveShadow = true;
        scene.add(muro2);
        group.push(muro2);

    }


    //MUROS INDESTRUCTIBLES VERTICAL
    for (var i = -7; i < -3; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 0);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = -7; i < -3; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = -7; i < -3; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -7; i < -1; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -400);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -7; i < -1; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 400);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -4; i < -2; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 600);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = 7; i < 9; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -600);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = 7; i < 11; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -1200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = -4; i < -1; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -1200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -10; i < -7; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -1000);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -12; i < -10; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -1200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }
    for (var i = -7; i < -5; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 800);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = -9; i < -7; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 1000);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = 5; i < 7; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 1200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = 5; i < 9; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 600);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = 5; i < 8; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 200);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = 5; i < 8; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, 0);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    for (var i = 8; i < 11; i++) {
        var ind1 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        ind1.position.set(i * -100, -50, -1000);
        ind1.receiveShadow = true;
        scene.add(ind1);
        group.push(ind1);

    }

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(900, -50, 400);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(1300, -50, 400);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(1100, -50, 200);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-200, -50, 1000);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1300, -50, 1000);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1100, -50, -600);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1000, -50, -800);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1000, -50, -900);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(1000, -50, 0);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(900, -50, 0);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1000, -50, 900);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1100, -50, 900);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1100, -50, 1000);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1100, -50, 1300);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-1100, -50, -300);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(1000, -50, -300);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-300, -50, -500);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-700, -50, -1300);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    var ind2 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind2.position.set(-500, -50, 1300);
    ind2.receiveShadow = true;
    scene.add(ind2);
    group.push(ind2);

    //INDESTRUCTIBLES 2
    for (var i = -5; i < -3; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-1200, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }


    for (var i = -8; i < -5; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-400, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 4; i < 8; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(200, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 6; i < 8; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(1000, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 4; i < 8; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(0, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 6; i < 8; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-600, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 10; i < 12; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(1200, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 10; i < 14; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(100, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -2; i < 2; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(0, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -6; i < -3; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(0, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -13; i < -9; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(0, -50, i * -100);
        i3.receiveShadow = true;
        //scene.add(i3)
        group.push(i3);

    }

    for (var i = -11; i < -9; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-600, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -11; i < -9; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-800, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    var i3 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i3.position.set(1000, -50, 1300);
    i3.receiveShadow = true;
    scene.add(i3)
    group.push(i3);

    var i3 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i3.position.set(800, -50, 1300);
    i3.receiveShadow = true;
    scene.add(i3)
    group.push(i3);

    var i3 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i3.position.set(400, -50, 500);
    i3.receiveShadow = true;
    scene.add(i3)
    group.push(i3);

    var i3 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i3.position.set(-600, -50, -1100);
    i3.receiveShadow = true;
    scene.add(i3)
    group.push(i3);


    for (var i = -13; i < -10; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(300, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -7; i < -3; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(1000, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -10; i < -8; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(1200, -50, i * -100);
        i3.receiveShadow = true;
       // scene.add(i3)
       // group.push(i3);

    }

    for (var i = 0; i < 3; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(1200, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 6; i < 9; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(500, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = 9; i < 11; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-300, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);

    }

    for (var i = -1; i < 2; i++) {
        var i3 = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
        );
        i3.position.set(-1200, -50, i * -100);
        i3.receiveShadow = true;
        scene.add(i3)
        group.push(i3);


    }

    //DESTRUCTIBLES        

    var group2 = new Array();
    for (var i = -13; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(400, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);
    }
    for (var i = -13; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(500, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -12; i < -8; i++) {
        var i4 = new destructible(null);
        i4.posicion(600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -7; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -8; i++) {
        var i4 = new destructible(null);
        i4.posicion(700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -7; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -2; i < 3; i++) {
        var i4 = new destructible(null);
        i4.posicion(800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 4; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -10; i++) {
        var i4 = new destructible(null);
        i4.posicion(900, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(900, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 5; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -12; i < -10; i++) {
        var i4 = new destructible(null);
        i4.posicion(800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 5; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 9; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(500, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 5; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(400, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 5; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 8; i < 11; i++) {
        var i4 = new destructible(null);
        i4.posicion(200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(900, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 11; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(900, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 11; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(1000, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(-100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < 13; i++) {
        var i4 = new destructible(null);
        i4.posicion(100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
    for (var i = 1; i < 11; i++) {
        var i4 = new destructible(null);
        i4.posicion(-200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -12; i < -7; i++) {
        var i4 = new destructible(null);
        i4.posicion(1000, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -3; i < 4; i++) {
        var i4 = new destructible(null);
        i4.posicion(200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -3; i < 0; i++) {
        var i4 = new destructible(null);
        i4.posicion(1000, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(1100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -3; i < 4; i++) {
        var i4 = new destructible(null);
        i4.posicion(300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(0, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 8; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(0, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -9; i++) {
        var i4 = new destructible(null);
        i4.posicion(200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -7; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -10; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 6; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(-300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 11; i++) {
        var i4 = new destructible(null);
        i4.posicion(-400, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
    for (var i = 1; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(-500, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 1; i < 6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -5; i < 6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(-900, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 7; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 7; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < 8; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1000, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -8; i < 3; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -11; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -13; i < -4; i++) {
        var i4 = new destructible(null);
        i4.posicion(1300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -3; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(1300, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -8; i < 0; i++) {
        var i4 = new destructible(null);
        i4.posicion(1200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -1; i < 12; i++) {
        var i4 = new destructible(null);
        i4.posicion(1100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 2; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(1200, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 8; i < 10; i++) {
        var i4 = new destructible(null);
        i4.posicion(1000, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = 7; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1100, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -9; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -11; i < -6; i++) {
        var i4 = new destructible(null);
        i4.posicion(-500, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -5; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-500, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -5; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-600, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -5; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
    for (var i = -5; i < -2; i++) {
        var i4 = new destructible(null);
        i4.posicion(-400, -20, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
        group2.push(i4);

    }
//SEGUNDO PISO
for (var i = -5; i < -2; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1200, 1140, i * -100);
    i4.receiveShadow = true;
scene.add(i4);
    group.push(i4);

}

for (var i = 0; i < 3; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1200, 1140, i * -100);
    i4.receiveShadow = true;
    scene.add(i4);

    group.push(i4);

}
for (var i = 10; i < 13; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, 0);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}

for (var i = 10; i < 15; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, -900);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}

for (var i = 12; i < 15; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, 900);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}

for (var i = 8; i < 10; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, 1100);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}
for (var i = 8; i < 10; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, -100);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}
for (var i = 9; i < 13; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, -700);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}
for (var i = 9; i < 13; i++) {
    var ind1 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    ind1.position.set(i * -100, 1140, -700);
    ind1.receiveShadow = true;
    scene.add(ind1);
    group.push(ind1);

}
for (var i = -6; i < -2; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-900, 1140, i * -100);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

}

for (var i = -6; i < 0; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1400, 1140, i * -100);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

}

for (var i = -4; i < 0; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-700, 1140, i * -100);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

}

for (var i = -4; i < 0; i++) {
    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-700, 1140, i * -100);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

}

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/lava.jpg") })
    );
    i4.position.set(-1200, 1140, -800);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1100, 1140, -500);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1100, 1140, -1000);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-1100, 1140, -1300);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-800, 1140, -600);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);

    var i4 = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/alga.jpg") })
    );
    i4.position.set(-800, 1140, 1000);
    i4.receiveShadow = true;
    scene.add(i4);
    group.push(i4);
   
//destructible segundo piso
 for (var i = -1; i < 15; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 2; i < 15; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -10; i < 15; i++) {
        var i4 = new destructible(null);
        i4.posicion(-600, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -9; i < 1; i++) {
        var i4 = new destructible(null);
        i4.posicion(-800, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -10; i < -7; i++) {
        var i4 = new destructible(null);
        i4.posicion(-900, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -13; i < -1; i++) {
        var i4 = new destructible(null);
        i4.posicion(-900, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -13; i < -1; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1000, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 1; i < 5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1100, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 1; i < 7; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1000, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 1; i < 7; i++) {
        var i4 = new destructible(null);
        i4.posicion(-900, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 8; i < 14; i++) {
        var i4 = new destructible(null);
        i4.posicion(-900, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -13; i < -1; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1100, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -14; i < 13; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1500, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -14; i < 13; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1500, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -12; i < -9; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1400, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -8; i < -5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1400, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -8; i < 9; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1300, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = -8; i < -5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1200, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 1; i < 3; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1200, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 7; i < 9; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1200, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i = 10; i < 15; i++) {
        var i4 = new destructible(null);
        i4.posicion(-1200, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i =-13; i < -9; i++) {
        var i4 = new destructible(null);
        i4.posicion(-600, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
for (var i =-13; i < -5; i++) {
        var i4 = new destructible(null);
        i4.posicion(-700, 1110, i * -100);
        i4.play(scene)
        i4.receiveShadow = true;
    }
    ascensor = new THREE.Mesh(
        new THREE.BoxGeometry(300, 50, 300),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    ascensor.position.set(-300, -100, -1200);
    ascensor.name = "ascensor";
    ascensor.isInUse = false;
    scene.add(ascensor);

    ascensor2 = new THREE.Mesh(
        new THREE.BoxGeometry(300, 50, 300),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    ascensor2.position.set(-300, -100, 1200);
    ascensor2.name = "ascensor2";
    ascensor2.isInUse = false;
    scene.add(ascensor2);

    ascensor3 = new THREE.Mesh(
        new THREE.BoxGeometry(300, 50, 300),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    ascensor3.position.set(-300, -100, 100);
    ascensor3.name = "ascensor3";
    ascensor3.isInUse = false;
    scene.add(ascensor3);

    for (var i = 0; i < group.length; i++) {
        collidableLista.push(group[i]);
    }
  
    geometry = new THREE.PlaneGeometry(3000, 3000, 3);
    //Mapeo de las texturas sobre las caras de plano
    suelo = new THREE.Mesh(geometry, material);
    suelo.position.set(0, -100, 0);
    suelo.rotation.x = - Math.PI * 0.5;
    suelo.receiveShadow = true;
    scene.add(suelo);

    collidableLista.push(columna1);
    collidableLista.push(columna2);
    collidableLista.push(plataforma);
    collidableLista.push(ascensor);
    collidableLista.push(ascensor2);
    collidableLista.push(ascensor3);
    collidableLista.push(suelo);
    collidableLista.push(players.p1.element);

}
 var cronometro;

function deternese() {
    clearInterval(cronometro);
}

function carga() {
    console.log("estoy en cronometro");
    contador_s = 0;
    contador_m = 0;
    s = document.getElementById("segundos");
    m = document.getElementById("minutos");
    cronometro = setInterval(
        function() {
            if (contador_s == 60) {
                contador_s = 0;
                contador_m++;
                0
                if (contador_m == 10) {
                    let anuncio = document.getElementById("anuncio");
                    anuncio.style.visibility = "visible"; 
                    showHideGame();
                    contador_m = 0;
                }
                m.innerHTML = contador_m;
            }
            s.innerHTML = contador_s;
            contador_s++;
            if (contador_m == 2 && contador_s == 51) {
                {
                    setTimeout(function() { reproducirfinal(); }, 5000);

                }
            } 
            console.log(m+"--"+s);
        }, 1000);
} 
function VerificarJugadoryControl(jugadorescogidofinal,controlescogido){
    if(jugadorescogidofinal!=undefined && controlescogido!=undefined){
        //console.log("PUBLICA"+jugadorescogidofinal);
        playerESCO=jugadorescogidofinal;
       // console.log("PUBLICA"+controlescogido);
        controlESCO=controlescogido;
        var es= new Escogidos(playerESCO,controlESCO);
        /* var escogido= new escogidos(playerESCO,controlESCO);*/
        escogidosJ.push(es); 
}
}

/**
 * Function to render application over
 * and over.
 */
function animateScene() {
    requestAnimationFrame(animateScene);
    if (!cargador.loadState && cargador.objsToLoad > 0) {
        console.log(`Cargando juego, Progreso: ${cargador.objsLoaded}/${cargador.objsLoaded + cargador.objsToLoad} `)
    } else {
        if (!cargador.sceneIsReady) {
            //cargarModelos();
            cargador.sceneIsReady = true;
            initObjects();
        }
        updateScene();
        renderizar();
    }

}

function cargarModelos() {
    for (var i = 0; i < Object.keys(modelos).length; i++) {

        console.log(modelos);

        if (modelos[Object.keys(modelos)[i]]["player"] != null) {
            window[modelos[Object.keys(modelos)[i]]["player"]] = modelos[Object.keys(modelos)[i]]["obj"];
            scene.add(window[modelos[Object.keys(modelos)[i]]["player"]]);
        } else {
            console.log(modelos[Object.keys(modelos)[i]]["obj"]);
            scene.add(modelos[Object.keys(modelos)[i]]["obj"]);
        }

    };
}

/**
 * Function to evaluate logic over and
 * over again.
 */
function updateScene() {
    lastTime = Date.now();

    //Updating camera view by control inputs
    //cameraControl.update();  
    cameraControl2.update();
    //cameraControl3.update();
    //cameraControl4.update();

    //Funciones para las camaras
    players.p1.seguimientocam(cameras.current);
    players.p1.seguimientocam(cameras.up);
    players.p1.perseguirobjeto(cameras.camaraseguimiento);

    //Sound Update

    
    //Controls uptade
    if (juega1) {
        players.p1.updateControls();
        players.p1.collidableBox.update(players.p1.control);
        players.p1.seguimientoluz(spotLight);
    }

    // explosivoslista[0].Collidablexplosion.update(explosivoslista[0].control);
    if (juega2) {
        players.p2.updateControls();
        players.p2.collidableBox.update(players.p2.control);
        players.p2.seguimientoluz(spotLight2);
    }

    if (juega3) {
        players.p3.updateControls();
        players.p3.collidableBox.update(players.p3.control);
        players.p3.seguimientoluz(spotLight3);
    }



    if (keyboard.pressed("2")) {
        console.log("oprimido2");
        camerasactivada = "2";
    }

    if (keyboard.pressed("1")) {
        console.log("oprimido1");
        camerasactivada = "1";
        renderizar(camerasactivada);
    }
    if (keyboard.pressed("3")) {
        console.log("oprimido3");
        camerasactivada = "3";
    }
    if (keyboard.pressed("4")) {
        console.log("oprimido4");
        camerasactivada = "4";
    }

    if (jugadores.length == 1) {
        if(jugadores[0].name=="P1"){
            let ganador1 = document.getElementById("ganador1");
            ganador1.style.visibility = "visible"; 
            
         

        }
        if(jugadores[0].name=="P2"){
            let ganador2 = document.getElementById("ganador2");
            ganador2.style.visibility = "visible"; 
           // setTimeout(function(){ showHideGame();},1000);


        }
        if(jugadores[0].name=="P3"){
            let ganador3 = document.getElementById("ganador3");
            ganador3.style.visibility = "visible"; 
           // setTimeout(function(){ showHideGame();},1000);

        }
        if(jugadores[0].name=="P4"){
            let ganador4 = document.getElementById("ganador4");
            ganador4.style.visibility = "visible"; 
           // setTimeout(function(){ showHideGame();},1000);


        }
       // console.log("El ganador es " + jugadores[0].name);
    } else {
        //console.log("no hay ganador");
    }
    if (acabadotiempo == true) {
        //console.log("EL JUEGO SE ACABADO POR TIEMPO");
    }
    if(ascensor3.position.y>1100 && !ascensor3.isInUse){
        ascensor3.position.y-=1;
    }
    if(ascensor2.position.y>1100 && !ascensor2.isInUse){
        ascensor2.position.y-=1;
    }
    if(ascensor.position.y>1100 && !ascensor.isInUse){
        ascensor.position.y-=1;
    }

}
function renderizar() {
    switch (camerasactivada) {
        case "2":
            renderer.render(scene, cameras.current);

            break;
        case "1":
            renderer.render(scene, cameras.default);
            break;
        case "3":
            renderer.render(scene, cameras.up);
            break;
        case "4":
            renderer.render(scene, cameras.camaraseguimiento);
            break;
        default:
            renderer.render(scene, cameras.default);
            break;
    }

}

function onWindowResize() {
    cameras.current.aspect = window.innerWidth / window.innerHeight;
    cameras.current.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


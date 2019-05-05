var cont = 0;
class Player {

    constructor(name, element, control) {
        this.name = name;
        this.control = control;
        this.element = element;
        this.estado= "vivo";
        this.vy = 0;
        this.vx = 10;
        this.m = 1;

    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        if (this._element != null) {
            this._element.name = this.name;
        }
    }
    set element(mesh) {
        this._element = mesh;
        let geometry = new THREE.BoxGeometry(60, 100, 60)
        let material = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false, transparent: true, opacity: 0 });
        var helper = new THREE.Mesh(geometry, material);
        //helper.position.y=50;
        helper.name = "helper" + cont;
        this.element.add(helper);
        this.control.element = this._element;
        this.control.player = this;
        this.control.habilitadobom = true;
        this.control.contmuro = 1;
        this.control.cantibombas = 1;
        this.control.conteobom = 0;
        this.estado="vivo";
        //console.log(this);
   
        collidableLista.push(helper);
        destructibleslist.push(helper);
        // destructibleslist.push(this._element);
        cont++;
    }
    deshabilitar() {
        console.log("procede a deshabilitar");
        this.control.habilitadobom = false;
    }
    habilitar() {
        var cont = 0;
        var id = setInterval(() => {
            cont++;
            console.log("Habilitado nuevamente");
            this.control.habilitadobom = true;
            if (cont == 1) {
                clearInterval(id);
            }
        }, 5000);


    }
    posicion(x,y,z){
    this._element.set.position(x,y,z);
    }
    aumenta() {
        this.control.contmuro++;
    }
    get element() {
        return this._element;
    }
    updateControls() {
        this.control.update(this.vx, this.vy, this.m, 49);
    }

    seguimientoluz(SpotLight) {
        SpotLight.target = this.element;
    }
    seguimientocam(PerspectiveCamera) {
        PerspectiveCamera.lookAt(this.element.position);
    }

    perseguirobjeto(PerspectiveCamera) {
        var relativeCameraOffset = new THREE.Vector3(0, 2, 60);
        var cameraOffset = relativeCameraOffset.applyMatrix4(this.element.matrixWorld);
        PerspectiveCamera.position.x = cameraOffset.x;
        PerspectiveCamera.position.y = cameraOffset.y;
        PerspectiveCamera.position.z = cameraOffset.z;
        PerspectiveCamera.lookAt(this.element.position);
    }
    play() {
        this.collidableBox = new CollidableBox(this.element, 80);
       /*  let playerBox = document.createElement("div");
        playerBox.classList.add("player");
        let color = document.createElement("div");
        color.classList.add("color");

        let r = 40;
        let g = 40;
        let b = 40;

        color.style.background = `rgb(${r},${g},${b})`;
        console.log(r);

        let name = document.createElement("div");
        name.classList.add("name");
        name.innerHTML = this.name;
        playerBox.appendChild(color);
        playerBox.appendChild(name);
        document.body.appendChild(playerBox); */

        scene.add(this.element);

    }

    delete() {
        scene.remove(this.element);
        for(var i=0;i<jugadores.length;i++){
            //console.log(collidableLista[i])
              if(jugadores[i].name != undefined){
             //     console.log("entra")
                  if(jugadores[i].name!=""){
                      if(jugadores[i].name==this._element.name){
                          scene.remove(this._element);
                          jugadores.splice(i, 1);
                      }
                  }     
              }  
          }
        this.estado="muerto";
        Die = new Sound(["assets/sounds/Die.mp3"],scene);
        Die.play();
    }
}
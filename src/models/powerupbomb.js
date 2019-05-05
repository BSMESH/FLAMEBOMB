contpowerbomb=0;
class powerupbomba {
    constructor(element) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.element=element;
    }

    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {
           // console.log("se crea powerup")
            let geometry = new THREE.SphereGeometry(25, 10, 10)
            let material = new THREE.MeshPhongMaterial({ color: 0x9b21ce,
                emissive: 0x0,
                 specular: 0xff0000,
                 shininess: 200, 
                 wireframe: false});
            this._element = new THREE.Mesh(geometry, material);
            this._element.castShadow = true;
            this._element.receiveShadow = true;
            this._element.name="aumentabomb"+contpowerbomb;
            this._element.type="aumentadorbomb";
            this._element.position.set(this.getRandomArbitrary(), -40, this.getRandomArbitrary());
            collidableLista.push(this._element);
            contpowerbomb++;
        }
        
    }
    get element() {
        return this._element;
    }
    play() {
        scene.add(this._element);
    }
     getRandomArbitrary=function() {
         var min=-1300;
         var max=1300;
        return Math.random() * (max - min) + min;
      }
}
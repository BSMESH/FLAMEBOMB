contpowerveli=0;
class powerup {
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
            let material = new THREE.MeshPhongMaterial({ color: 0x8fc42,
                emissive: 0x39f500,
                 specular: 0xff0000,
                 shininess: 200, 
                 wireframe: false});
            this._element = new THREE.Mesh(geometry, material);
            this._element.castShadow = true;
            this._element.receiveShadow = true;
            this._element.name="velocidad"+contpowerveli;
            this._element.type="velocidad";
            this._element.position.set(this.getRandomArbitrary(), -40, this.getRandomArbitrary());
            collidableLista.push(this._element);
            contpowerveli++;
        }
        
    }
    get element() {
        return this._element;
    }
    play(scene) {
        scene.add(this._element);
    }
    delete() {
        //console.log(collidableLista)
        for(var i=0;i<collidableLista.length;i++){
         //   console.log(collidableLista[i])
            if(collidableLista[i].name != undefined){
           //     console.log("entra")
                if(collidableLista[i].name!=""){
                    if(collidableLista[i].name==this._element.name){
                        scene.remove(this._element);
                        collidableLista.splice(i, 1);
                    }
                }     
            }  
        }
       // console.log(collidableLista)
    }
     getRandomArbitrary=function() {
         var min=-1300;
         var max=1300;
        return Math.random() * (max - min) + min;
      }
}
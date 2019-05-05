var contbomb=0;
class Bomba {
    constructor(element, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.element = element;
    }

    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {
            let geometry = new THREE.BoxGeometry(50,50,50);
            let material = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false,transparent: true });
            this._element = new THREE.Mesh(geometry, material);
            let geometry2 = new THREE.SphereGeometry(60,100,60)
            let material2 = new THREE.MeshPhongMaterial({ color: 0x000000, wireframe: false });
            var helper = new THREE.Mesh(geometry2, material2);
            this._element.add(helper); 
            this._element.castShadow = true;
            this._element.receiveShadow = true;
            this._element.position.set(this.x, this.y-20, this.z)
            this._element.name="bomba"+contbomb;
            collidableLista.push(this._element);
            contbomb++;
        }
        
    }

    get element() {
        return this._element;
    }

    play() {
        scene.add(this._element);
        //console.log(this.name);
    }
    delete(){
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
    
}


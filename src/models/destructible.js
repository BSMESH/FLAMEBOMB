contm=0;
class destructible {
    constructor(element) { 
        this.element = element;
    
    }
    set element(mesh) {
        if (mesh instanceof THREE.Mesh) {
            this._element = mesh;
        } else {
            let geometry = new THREE.BoxGeometry(100, 100, 100);
            let material = new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/destructibles.jpg") });
            this._element = new THREE.Mesh(geometry, material);
            this._element.castShadow = true;
            this._element.receiveShadow = true;
            this._element.name="muro"+contm;
            collidableLista.push(this._element);
            destructibleslist.push(this._element);
            contm++;
        }
    }
    get element() {
        return this._element;
    }
    play() {
        scene.add(this.element);
    }
    delete() {
        for(var i=0;i<collidableLista.length;i++){
           //console.log(collidableLista[i])
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
      //9'0pconsole.log(collidableLista)
    }
    deleteex() {
        //console.log(collidableLista)
        for(var i=0;i<destructibleslist.length;i++){
         //   console.log(destructibleslist[i])
            if(destructibleslist[i].name != undefined){
           //     console.log("entra")
                if(destructibleslist[i].name!=""){
                    if(destructibleslist[i].name==this._element.name){
                        scene.remove(this._element);
                        destructibleslist.splice(i, 1);
                    }
                }     
            }  
        }
       // console.log(destructibleslist)
    }

    posicion(x,y,z){
        this._element.position.set(x, y-30, z);
    }

}
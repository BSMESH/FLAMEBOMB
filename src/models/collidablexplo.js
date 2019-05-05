class Collidablexplo {
    constructor(mesh, boundingRadius) {
        this.mesh = mesh;
        this.collidableRadius = boundingRadius;
        // this.initBoundingMesh(this.mesh);
    }
    initBoundingMesh(mesh) {
        //console.log(mesh);
        this.collidableRadius = mesh.geometry.boundingSphere.radius;
    }
    collide(normal) {
        let collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);
        let origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);
        let intersections = collidableRay.intersectObjects(destructibleslist);
//console.log("las intersecciones son: "+intersections);
            if (intersections.length > 0) {    
                let distance = intersections[0].distance;
             //  console.log("la distancia es: "+distance);
                if (distance < 200) {
                    
                  for(var i=0;i<destructibleslist.length;i++){
               //   console.log(destructibleslist[i])
                       if(destructibleslist[i].name != undefined){
                       // console.log("entra")
                           if(destructibleslist[i].name!=""){
                               if(destructibleslist[i].name==intersections[0].object.name){
                                  //console.log("borra: "+destructibleslist[i].name);
                                  switch(intersections[0].object.name){
                                      case "helper0":
                                      players.p1.delete();
                                      console.log(players.p1.estado);
                                      break;
                                      case "helper1":
                                      players.p2.delete();
                                      console.log(players.p2.estado);
                                      break;
                                      case "helper2":
                                      players.p3.delete();
                                      console.log(players.p3.estado);
                                      break;
                                      default:
                                      /*destructibleslist.delete() */
                                   scene.remove(destructibleslist[i]);
                                   destructibleslist.splice(i, 1);
                                      break;
                                  }
                                   
                               }
                           }     
                       }  
                   }
                   for(var i=0;i<collidableLista.length;i++){
                  //  console.log(collidableLista[i])
                      if(collidableLista[i].name != undefined){
                     //    console.log("entra")
                          if(collidableLista[i].name!=""){
                              if(collidableLista[i].name==intersections[0].object.name){
                                  /* console.log("borra: "+collidableLista[i]);
                                  collidableLista.delete() */
                                  scene.remove(collidableLista[i]);
                                  collidableLista.splice(i, 1);
                              }
                          }     
                      }  
                  }
                }else{
                    //console.log("no choca");
                } 
            }
        
        }
    collideLeft() {
        this.collide({ x: 0, y: 0, z: 1 });
    }

    collideRight() {
        this.collide({ x: 0, y: 0, z: -1 });
    }
    collideFront() {
        this.collide({ x: -1, y: 0, z: 0 });
    }
    collideBack() {
        this.collide({ x: 1, y: 0, z: 0 });
    }
}
   
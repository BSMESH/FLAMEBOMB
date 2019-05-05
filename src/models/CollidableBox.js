var fg = 0.4;
class CollidableBox {
    constructor(mesh, boundingRadius) {

        this.mesh = mesh;
        this.collidableRadius = boundingRadius;
        this.isFalling = { state: false, acc: 0 };
        // this.initBoundingMesh(this.mesh);
    }
    initBoundingMesh(mesh) {
        //console.log(mesh);
        this.collidableRadius = mesh.geometry.boundingSphere.radius;
    }

    collide(normal, callback, verticalColliding = false) {
        let collidableRay = new THREE.Raycaster();
        collidableRay.ray.direction.set(normal.x, normal.y, normal.z);

        let origin = this.mesh.position.clone();
        collidableRay.ray.origin.copy(origin);
        let intersections = collidableRay.intersectObjects(collidableLista);
        if (verticalColliding) {
            if (intersections.length > 0) {
                callback(intersections);


            } else {
                this.isFalling.state = true;
                this.isFalling.acc += 1;
                this.mesh.position.y -= 1 * this.isFalling.acc;
            }

        } else {
            if (intersections.length > 0) {
                let distance = intersections[0].distance;
                if (distance <= this.collidableRadius - 50) {
                    callback();
                }
                if (distance <= 50) {
                    /* console.log("se choca con :"+intersections[0].object.name);
                    console.log("el objeto: "+this.mesh.name); */
                    switch (intersections[0].object.type) {
                        case "velocidad":
                            if (this.mesh.name == "P1") {

                                for (var i = 0; i < collidableLista.length; i++) {
                                    if (collidableLista[i].name == intersections[0].object.name) {
                                        scene.remove(collidableLista[i]);
                                        collidableLista.splice(i, 1);
                                    }
                                }
                                players.p1.vx += 0.4;

                            }
                            if (this.mesh.name == "P2") {
                                for (var i = 0; i < collidableLista.length; i++) {
                                    if (collidableLista[i].name != undefined) {
                                        if (collidableLista[i].name != "") {
                                            if (collidableLista[i].name == intersections[0].object.name) {
                                                scene.remove(collidableLista[i]);
                                                collidableLista.splice(i, 1);
                                            }
                                        }
                                    }
                                }
                                players.p2.vx += 0.4;

                            }
                            break;
                        case "aumentadorbomb":
                            if (this.mesh.name == "P1") {
                                for (var i = 0; i < collidableLista.length; i++) {
                                    if (collidableLista[i].name == intersections[0].object.name) {
                                        scene.remove(collidableLista[i]);
                                        collidableLista.splice(i, 1);
                                    }
                                }
                                players.p1.control.cantibombas++;

                            }
                            if (this.mesh.name == "P2") {
                                for (var i = 0; i < collidableLista.length; i++) {
                                    if (collidableLista[i].name == intersections[0].object.name) {
                                        scene.remove(collidableLista[i]);
                                        collidableLista.splice(i, 1);
                                    }
                                }
                                players.p2.control.cantibombas++;

                            }
                            break;

                    }
                }
            }

        }
    }
    collideLeft(controls) {
        let callback = () => {
            this.mesh.position.z -= controls.vx;
        }
        this.collide({ x: 0, y: 0, z: 1 }, callback);

    }

    collideRight(controls) {
        let callback = () => {
            this.mesh.position.z += controls.vx;
        }
        this.collide({ x: 0, y: 0, z: -1 }, callback);
    }
    collideFront(controls) {
        let callback = () => {
            this.mesh.position.x += controls.vx;
        }
        this.collide({ x: -1, y: 0, z: 0 }, callback);
    }
    collideBack(controls) {
        let callback = () => {

            this.mesh.position.x -= controls.vx;

        }
        this.collide({ x: 1, y: 0, z: 0 }, callback);
    }
    collideBottom(control) {
        let callback = (intersections) => {
            let distance = intersections[0].distance +40 ;
            //console.log(`distance: ${distance} CR: ${this.collidableRadius}`)
            if (distance > this.collidableRadius) { //inAir
                this.isFalling.state = true;
                this.isFalling.acc += 10;
                this.mesh.position.y -= 0.6 * this.isFalling.acc;
                //console.log("in air")
                control.isInAir = true;

            }
            if (distance <= this.collidableRadius) { //over the floor
                // console.log("over the floor")
                control.isJumping = false;
                control.isInAir = false;
                this.isFalling.state = false;
                this.isFalling.acc = 0;
                if (distance <= this.collidableRadius) {
                    this.mesh.position.y += 10;
                }switch (intersections[0].object.name) {
                    case "ascensor":
                        ascensor.isInUse = true;
                        ascensor.position.y += 10;
                  
                    break;
                    
                    case "ascensor2":
                        ascensor2.isInUse = true;
                        ascensor2.position.y += 10;
                    break;

                    case "ascensor3":
                        ascensor3.isInUse = true;
                        ascensor3.position.y += 10;
              
                    break;
                        case "thanos":
                       this.mesh.material.color = new THREE.Color("0xffffff")
                    break;
                }
                
            }else{
                console.log("se bajo");
                ascensor.isInUse = false;
                ascensor2.isInUse = false;
                ascensor3.isInUse = false;
            }



        }
        this.collide({ x: 0, y: -1, z: 0 }, callback, true);
    }


    update(controls) {
        this.collideLeft(controls);
        this.collideRight(controls);
        this.collideFront(controls);
        this.collideBack(controls);
        this.collideBottom(controls);
    }

}
verificacion = function (valor, mesh) {
    // console.log(valor);
    switch (valor) {
        case "velocidad1":
            console.log(mesh.name);
            switch (mesh.name) {
                case "helper0":
                    powerup1.delete();
                    players.p1.vx += 0.5;
                    break;
                case "helper1":
                    powerup1.delete();
                    players.p2.vx += 0.5;
                    break
            }

            break;
    }
}
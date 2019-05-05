var x,y,z;
/* var habilitadoparabomba=true;
var habilitadodesaparecer=false; */
var habilitadoparamuro=true;
var habilitadodesaparecermuro=false;
//var contmuro=0;
class Control {
    //myControl = new Control("w","d","s","a");
    constructor(up, right, down, left,jump,bomba,muro,isInAir,isFalling,isJumping) {
        this.initControls();       
        this.up = up || "w";
        this.right = right || "d";
        this.down = down || "s";
        this.left = left || "a";
        this.jump=  jump || "z";
        this.bomba=  bomba || "q";
        this.muro=  muro || "e";
        this.element = null;
        this.isInAir=isInAir;
        this.isFalling=isFalling;
        this.isJumping=isJumping;
        this.habilitadobom=null;
        this.contmuro=null;
        this.player=null;
        this.cantibombas=null;
        this.conteobom=null;
        this.initListeners();
    }

    set up(key) {
        this._up.key = key;
    }

    get up() {
        return this._up.key;
    }

    set right(key) {
        this._right.key = key;
    }

    get right() {
        return this._right.key;
    }

    set down(key) {
        this._down.key = key;
    }

    get down() {
        return this._down.key;
    }

    set left(key) {
        this._left.key = key;
    }

    get left() {
        return this._left.key;
    }

    set jump(key) {
        this._jump.key = key;
    }

    get jump() {
        return this._jump.key;
    }

    set bomb(key) {
        this._bomba.key = key;
    }

    get bomb() {
        return this._bomba.key;
    }

    set bomb(key) {
        this._muro.key = key;
    }

    get bomb() {
        return this._muro.key;
    }

    initControls() {
        this._up = { key: "", isPressed: false };
        this._right = { key: "", isPressed: false };
        this._down = { key: "", isPressed: false };
        this._left = { key: "", isPressed: false };
        this._jump = { key: "", isPressed: false };
        this._bomba = { key: "", isPressed: false };
        this._muro = { key: "", isPressed: false };
    }

    initListeners() {


    }
    
    update(vx,vy,m,jf) {
        this.vx = vx;
        this.vy = vy;
        this.m = m;
        this.jumpForce = jf;
        if (this._up.isPressed) {
            this.element.position.x -= this.vx;
            this.element.rotation.y = -Math.PI/2;
        }
        if (this._right.isPressed) {
            this.element.position.z -= this.vx;
            this.element.rotation.y = -Math.PI;
        }
        if (this._down.isPressed) {
            this.element.position.x += this.vx;
            this.element.rotation.y =Math.PI/2;
        }
        if (this._left.isPressed) {
            this.element.position.z += this.vx;
            this.element.rotation.y = 0;
        }
        if (this._jump.isPressed) {
            console.log(`is Jumping: ${this.isJumping} and is In Air: ${this.isInAir}`)
            if(!this.isJumping && !this.isInAir){
                this.isJumping = true;
                this.element.position.y += this.jumpForce;
            } 
        } 
        if(this._bomba.isPressed){
            x=this.element.position.x;
            y=this.element.position.y;
            z=this.element.position.z;
            //console.log("x:"+x,"y:"+y,"z:"+z);
        }
        if(this._muro.isPressed){
            x=this.element.position.x;
            y=this.element.position.y;
            z=this.element.position.z;
            //console.log("x:"+x,"y:"+y,"z:"+z);
        }
           
            /* */
           
    }
     

    pressUp() {
        this._up.isPressed = true;
    }
    pressRight() {
        this._right.isPressed = true;
    }
    pressDown() {
        this._down.isPressed = true;
    }
    pressLeft() {
        this._left.isPressed = true;
    }
    pressJump() {
        this._jump.isPressed = true;
        JumpSound.play();
    }
    pressBomb() {
        this._bomba.isPressed = true;
        putBombSound.play();
    }
    pressMuro() {
        this._muro.isPressed = true;
    }

    releaseUp() {
        this._up.isPressed = false;
    }
    releaseRight() {
        this._right.isPressed = false;
    }
    releaseDown() {
        this._down.isPressed = false;
    }
    releaseLeft() {
        this._left.isPressed = false;
    }
    releaseJump() {
        this._jump.isPressed = false;
    }
    releaseBomb() {
        this._bomba.isPressed = false;
        if(this.habilitadobom==true){
            if(this.conteobom<=this.cantibombas){
                console.log("la cantidad de bombas colocadas es: "+this.conteobom);
                console.log("Coloca bomba");
                var bombita = new Bomba(null,x,y,z);
                bombita.play();
                setTimeout(function(){
                    var explosionxp = new THREE.Mesh(
                        new THREE.BoxGeometry(200, 100, 100),
                        new THREE.MeshLambertMaterial({ color: 0xf78a0f, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
                    );
                    explosionxp.position.set(bombita.x+100, bombita.y, bombita.z);
                    scene.add(explosionxp);
                    
                    var explosionxn = new THREE.Mesh(
                        new THREE.BoxGeometry(200, 100, 100),
                        new THREE.MeshLambertMaterial({ color: 0xf78a0f, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
                    );
                    explosionxn.position.set(bombita.x-100, bombita.y, bombita.z);
                    scene.add(explosionxn);
                    
                    var explosionzp = new THREE.Mesh(
                        new THREE.BoxGeometry(100, 100, 200),
                        new THREE.MeshLambertMaterial({ color: 0xf78a0f, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
                    );
                    explosionzp.position.set(bombita.x, bombita.y, bombita.z+100);
                    scene.add(explosionzp);
                    
                    var explosionzn = new THREE.Mesh(
                        new THREE.BoxGeometry(100, 100, 200),
                        new THREE.MeshLambertMaterial({ color: 0xf78a0f, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
                    );
                    explosionzn.position.set(bombita.x, bombita.y, bombita.z-100);
                    scene.add(explosionzn);
        
                    var collidablexplo=new Collidablexplo(bombita.element,4);
                    collidablexplo.collideLeft();
                    collidablexplo.collideRight();
                    collidablexplo.collideFront();
                    collidablexplo.collideBack();
                    bombita.delete();
                    ExplosionSound.play();
                    setTimeout(function(){scene.remove(explosionxn,explosionxp,explosionzn,explosionzp );}, 1500);
                },5000); 
                this.player.control.conteobom++;
                console.log("Ahora la cantidad de bombas colocadas es: "+this.conteobom);
                console.log("El maximo de bombas es: "+this.cantibombas);
                if(this.conteobom==this.cantibombas){
                    console.log("ha colocado la cantidad permitida");
                    this.player.deshabilitar();
                    this.player.habilitar();
                    this.player.control.conteobom=0;
                }else{
                    console.log("aun no ha colocado la cantidad maxima");
                }
            }
        } else{
            console.log("No está habilitado");
        }
       
    }
    releaseMuro() {
        this._muro.isPressed = false;

        if(this.contmuro<11){
            var muro= new destructible(null);
            muro.play(scene);
            muro.posicion(this.player.element.position.x,this.player.element.position.y,this.player.element.position.z);
            this.player.aumenta();
        }
    }

}
document.onkeydown = (e) => {
    
    for (let i = 0; i < Object.keys(players).length; i++) {
        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];
        //console.log(`Tecla presionada: ${e.key} Tecla up de este jugador ${elControl.up}`)
        switch (e.key) {
            case elControl.up:
                elControl.pressUp();
                break;
            case elControl.right:
                elControl.pressRight();
                break;
            case elControl.down:
                elControl.pressDown();
                break;
            case elControl.left:
                elControl.pressLeft();
                break;
            case elControl.jump:
                elControl.pressJump();
                break;
            case elControl.bomba:
                elControl.pressBomb();
                break;
            case elControl.muro:
                elControl.pressMuro();
                break;
        }

    }
}

document.onkeyup = (e) => {
    //console.log(Object.keys(players));
    for (let i = 0; i < Object.keys(players).length; i++) {

        let key = Object.keys(players)[i];
        if (players[key] == null) { return false; }
        let elControl = players[key]["control"];

        switch (e.key) {
            case elControl.up:
                elControl.releaseUp();
                break;
            case elControl.right:
                elControl.releaseRight();
                break;
            case elControl.down:
                elControl.releaseDown();
                break;
            case elControl.left:
                elControl.releaseLeft();
                break;
            case elControl.jump:
                elControl.releaseJump();
                break;
            case elControl.bomba:
                elControl.releaseBomb();
               // console.log("lasolté");
               // tiempo=
                break;
            case elControl.muro:
                elControl.releaseMuro();           
                break;
        }
    }
  
    
}/*  console.log("la posicion de la bomba es: "+bomba.x);
var explosionxp = new THREE.Mesh(
    new THREE.BoxGeometry(9, 3, 3),
    new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
);
explosionxp.position.set(bomba.x+4, bomba.y, bomba.z);
scene.add(explosionxp);

var explosionxn = new THREE.Mesh(
    new THREE.BoxGeometry(9, 3, 3),
    new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
);
explosionxn.position.set(bomba.x-4, bomba.y, bomba.z);
scene.add(explosionxn);

var explosionzp = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 9),
    new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
);
explosionzp.position.set(bomba.x, bomba.y, bomba.z+4);
scene.add(explosionzp);

var explosionzn = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 9),
    new THREE.MeshLambertMaterial({ color: 0x6a6a6a, map: new THREE.TextureLoader().load("assets/texturas/fuego.jpg") })
);
explosionzn.position.set(bomba.x, bomba.y, bomba.z-4);
scene.add(explosionzn);

var collidablexplo=new Collidablexplo(bomba.element,4);
collidablexplo.collideLeft();
collidablexplo.collideRight();
collidablexplo.collideFront();
collidablexplo.collideBack();
//console.log("Se desaparece");
bomba.delete();
setTimeout(function(){scene.remove(explosionxn,explosionxp,explosionzn,explosionzp);}, 1500);*/

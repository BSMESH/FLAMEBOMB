
function loadJSON(model, onloadCallback) {

    var loader = new THREE.ObjectLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },

        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}

var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
var onError = function () { };

function loadOBJ(model, onloadCallback) {

    var loader = new THREE.OBJLoader();

    loader.load(model, onloadCallback,
        // onProgress callback
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            LoadMTLobject(loader);
        },
        // onError callback
        function (err) {
            console.error('An error happened');
        }
    );
}


function LoadMTLobject(loader) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('assets/objects/mrincreible2.mtl', function (materials) {
        materials.preload();

        loader.setMaterials(materials);
        loader.load('assets/objects/mrincreible.obj', function (object) {
            object.position.y = 5;
        }, onProgress(), onError());
    });

}

/*function addModelToScene( geometry, materials ) 
{
	// for preparing animation
	for (var i = 0; i < materials.length; i++)
		materials[i].morphTargets = true;
		
	var material = new THREE.MeshFaceMaterial( materials );
	android = new THREE.Mesh( geometry, material );
	android.scale.set(10,10,10);
	scene.add( android );
} */

function loadObjWithMtl(folder,modelo, material, onloadCallback) {
    cargador.addObj();
    new THREE.MTLLoader()
        .setPath(folder)
        .load(material, function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setMaterials(materials)
                .setPath(folder)
                .load(modelo, onloadCallback, onProgress, onError);
        });
}

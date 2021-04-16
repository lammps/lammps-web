var position = new Float32Array( 12*maxNumAtoms );
var radii = new Float32Array( 4*maxNumAtoms );
var vertexId = new Uint8Array( 4*maxNumAtoms );
var indexBuffer = new Uint32Array( 6*maxNumAtoms );

function reallocate() {
    position = new Float32Array( 12*maxNumAtoms );
    radii = new Float32Array( 4*maxNumAtoms );
    vertexId = new Uint8Array( 4*maxNumAtoms );
    indexBuffer = new Uint32Array( 6*maxNumAtoms );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
    geometry.addAttribute( 'vertexId', new THREE.BufferAttribute( vertexId, 1 ) );
    geometry.addAttribute( 'radius', new THREE.BufferAttribute( radii, 1 ) );
    geometry.setIndex( new THREE.BufferAttribute( indexBuffer, 1 ) );
}

function glWindowWidth() {
    return $('#webglwindow').width();
}

function glWindowHeight() {
    return $('#webglwindow').height();
}

function initGL() {
    var webglwindow = document.getElementById("webglwindow");
    container = document.createElement( 'div' );
    webglwindow.appendChild( container );
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 60, glWindowWidth() / glWindowHeight(), 1, 1000 );
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;
    controls = new THREE.OrbitControls( camera, webglwindow );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.dampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );
    geometry.addAttribute( 'vertexId', new THREE.BufferAttribute( vertexId, 1 ) );
    geometry.addAttribute( 'radius', new THREE.BufferAttribute( radii, 1 ) );
    geometry.setIndex( new THREE.BufferAttribute( indexBuffer, 1 ) );
    
    material = new THREE.ShaderMaterial( {
        uniforms: {
            time: { value: 1.0 },
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );
    
    mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    scene.background = new THREE.Color( 0x000000 );
    renderer.setClearColor( 0x000000, 0);
    renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( glWindowWidth(), glWindowHeight() );
    container.appendChild( renderer.domElement );
    onWindowResize()
    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    camera.aspect = glWindowWidth() / glWindowHeight()
    camera.updateProjectionMatrix();
    renderer.setSize( glWindowWidth(), glWindowHeight() );
    console.log("GL window size: ", glWindowWidth(), ", ", glWindowHeight())
    render();
}

function updateVertices() {
    var systemSizeHalfVec = systemSizeHalf();
    var systemSizeVec = systemSize();
    if(maxNumAtoms !== Atomify.numberOfAtoms()) {
        maxNumAtoms = Atomify.numberOfAtoms()
        console.log("Reallocating memory to support ", maxNumAtoms, " atoms.")
        reallocate()
    }

    for ( i = 0; i < Atomify.numberOfAtoms(); i ++ ) {
        var x = getValue(Atomify.positions() + 24*i, 'double') - systemSizeHalfVec.x;
        var y = getValue(Atomify.positions() + 24*i + 8, 'double') - systemSizeHalfVec.y;
        var z = getValue(Atomify.positions() + 24*i + 16, 'double') - systemSizeHalfVec.z;

        var radius = 0.1;
        position[12*i+0] = x;
        position[12*i+1] = y;
        position[12*i+2] = z;

        position[12*i+3] = x;
        position[12*i+4] = y;
        position[12*i+5] = z;

        position[12*i+6] = x;
        position[12*i+7] = y;
        position[12*i+8] = z;

        position[12*i+9] = x;
        position[12*i+10] = y;
        position[12*i+11] = z;

        vertexId[4*i+0] = 0.0;
        vertexId[4*i+1] = 1.0;
        vertexId[4*i+2] = 2.0;
        vertexId[4*i+3] = 3.0;
        radii[4*i+0] = radius;
        radii[4*i+1] = radius;
        radii[4*i+2] = radius;
        radii[4*i+3] = radius;

        indexBuffer[6*i+0] = 4*i+0;
        indexBuffer[6*i+1] = 4*i+3;
        indexBuffer[6*i+2] = 4*i+2;
        indexBuffer[6*i+3] = 4*i+0;
        indexBuffer[6*i+4] = 4*i+1;
        indexBuffer[6*i+5] = 4*i+3;
    }
    
    geometry.getAttribute("position").needsUpdate = true
    geometry.getAttribute("vertexId").needsUpdate = true
    geometry.getAttribute("radius").needsUpdate = true
}

function animate() {
    if(!Atomify.active()) {
        return;
    }
    Atomify.runCommands("run 1 pre no post no");
    animationId = requestAnimationFrame( animate );
    controls.update();
    updateVertices();
    render();
}

function render() {
    t = (Date.now() - t0) / 1000;
    mesh.updateMatrix();
    camera.updateMatrixWorld();
    renderer.render( scene, camera );
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var t0 = Date.now();
var lights = {}
var container;
var animationId;
var camera, controls, scene, renderer, geometry, material, color;
var mesh;

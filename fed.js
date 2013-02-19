
var camera, scene, renderer,
    mouseX = 0, mouseY = 0,
    // animate,
    fillHue = 0,
    fedParticles;

function init() {

    // Camera params:
    // field of view, aspect ratio for render output, near and far clipping plane.
    camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 4000 );

    // Move the camera backwards so we can see stuff!
    // Default position is 0, 0, 0.
    camera.position.x = -500;
    camera.rotation.y = -0.5;
    camera.position.z = 500;

    // The scene contains all the 3D object data
    scene = new THREE.Scene();

    // And the CanvasRenderer figures out what the
    // stuff in the scene looks like and draws it!

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    makeParticles( fedParticles );

    // The renderer's canvas domElement is added to the body
    document.body.appendChild( renderer.domElement );

    // Render 30 times a second
    setInterval( update, 1000/30 );

}

function update() {

    // updateCamera();
    // updateParticles();
    renderer.render( scene, camera );
    
}

function makeParticles( particles ) {
    
    var particle, material;

    for ( var i = 0, length = particles.length; i < length; i += 1 ) {
        material = new THREE.ParticleCanvasMaterial({
            color: 0xCC0000,
            program: particleRender
        });

        particle = new THREE.Particle( material );

        particle.position.x = particles[i][0] - ( 778 );
        particle.position.y = ( 68 - particles[i][1] ) + 180;
        particle.position.z = Math.random() * 10 - 5;
        // particle.position.z = Math.random() * ( particles[i][0] * 0.1 );

        scene.add( particle );
    }


}

function particleRender( context ) {
    context.beginPath();
    context.arc( 0, 0, 1, 0, Math.PI * 2, true );
    context.fill();
}

function updateCamera() {
    camera.position.z -= 10;
    if ( camera.position.z < 0 ) {
        camera.position.z = 1000;
    }
}


$( document ).ready(function() {
    $( 'canvas' ).remove();
    fedParticles = $.getJSON( 'js/fedParticles.json', function( data ) {
        fedParticles = data;
        init();
    });
});


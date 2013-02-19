(function() {

    // Three.js essentials
var camera, scene, renderer,
    // Keep track of the mouse
    mouseX = 0, mouseY = 0,
    // Used for progressively changing the hue
    fillHue = 0,
    // Build an array of x, y coordinates based off of the FED Logo
    fedParticles,
    $drifter = $( '<div />' ).appendTo( 'body' );

function init() {

    var $body = $( 'body' );

    // Don't initialize till our articles actually have height/width
    // This is a hacky way of creating an onready event for the slides
    if ( ! $( 'article' ).first().width() ) {

        setTimeout( init, 100 );

    } else {

        var $canvas = $( '<canvas />' ).appendTo( '.biglogo' ),
            canvas = $canvas[0],
            $parent = $canvas.parent(),
            ctx = canvas.getContext( '2d' );
        
        ctx.canvas.width = $parent.width();
        ctx.canvas.height = $parent.height();

        // Add the mouse move listener
        document.addEventListener( 'mousemove', onMouseMove, false );

        // The most important step! Draw the FED logo
        draw( ctx );

        // Use a setInterval if you want to animate the logo
        // setInterval( (function() { draw( ctx ) }), 1000/30 );

        // Go nuts with other effects if you prefer
        // var fedParticles = particleize( ctx, 10 );
        fedParticles = particleize( ctx, 10 );

        $canvas.remove();

        // drawParticles( ctx, fedParticles );
        // setInterval( (function() { drawParticles( ctx, fedParticles ) }), 1000/12 );

        // Camera params:
        // field of view, aspect ratio for render output, near and far clipping plane.
        camera = new THREE.PerspectiveCamera( 80, $parent.width() / $parent.height(), 1, 4000 );
        
        // Move the camera backwards so we can see stuff!
        // Default position is 0, 0, 0.
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.position.z = 400;
        console.log( camera );

        // The scene contains all the 3D object data
        scene = new THREE.Scene();

        // And the CanvasRenderer figures out what the
        // stuff in the scene looks like and draws it!

        renderer = new THREE.CanvasRenderer();
        renderer.setSize( $parent.width(), $parent.height() );

        // makeFrame( $parent );
        makeParticles( fedParticles );

        // The renderer's canvas domElement is added to the body
        $parent.append( renderer.domElement );

        // Render 30 times a second
        setInterval( update, 1000/30 );

        $( '<div />' ).css({
                'fake-z': 4000
            })
            .animate({
                'fake-z': 400
            }, {
                duration: 4000,
                easing: 'easeOutBounce',
                step: function( x, fx ) {
                    camera.position.z = x;
                }
            });

            /*
        $( '<div />' ).css({
                height: 2
            })
            .animate({
                height: 0 
            }, {
                duration: 4000,
                easing: 'easeOutBack',
                step: function( x, fx ) {
                    camera.rotation.x = x;
                    camera.rotation.y = x;
                }
                // complete: drift
            });
            */

        $drifter.css({
                'fake-zs': 5
            })
            .animate({
                'fake-zs': 0
            }, {
                duration: 4000,
                easing: 'linear',
                step: function( x, fx ) {
                    for ( var i = 0, length = scene.children.length; i < length; i++ ) {
                        var z = scene.children[i].position.z;

                        if ( z > 100 ) {
                            scene.children[i].position.z = z - 100;
                        } else if ( z < -100 ) {
                            scene.children[i].position.z = z + 100;
                        }

                        if ( z > 50 ) {
                            scene.children[i].position.z = z - 50;
                        } else if ( z < -50 ) {
                            scene.children[i].position.z = z + 50;
                        }

                        if ( z > 5 ) {
                            scene.children[i].position.z = z - 5;
                        } else if ( z < -5 ) {
                            scene.children[i].position.z = z + 5;
                        }

                        if ( z > 0 ) {
                            scene.children[i].position.z = z - 1;
                        } else if ( z < 0 ) {
                            scene.children[i].position.z = z + 1;
                        }
                    }
                }
            });

        console.log( scene );

        function drift() {

            var x = Math.round( ( Math.random() * 100 ) - 50 ),
                y = Math.round( ( Math.random() * 100 ) - 50 );

            $drifter.animate({
                    'fake-x': x,
                    'fake-y': y
                }, {
                    duration: 4000,
                    easing: 'linear',
                    step: function( x, fx ) {
                        // console.log( x );
                        if ( fx.prop === 'fakeX' ) {
                            camera.rotation.x = x / 100;
                        } else if ( fx.prop === 'fakeY' ) {
                            camera.rotation.y = x / 100;
                        }
                    },
                    complete: drift
                });
            
        }
        
    }
}

function update() {

    // updateCamera();
    // updateParticles();
    renderer.render( scene, camera );
    
}

function makeParticles( particles ) {
    
    var particle, material;

    material = new THREE.ParticleCanvasMaterial({
        color: 0xCC0000,
        program: particleRender,
    });

    for ( var i = 0, length = particles.length; i < length; i += 1 ) {

        particle = new THREE.Particle( material );

        // Three.js's canvas has an interesting relationship to a regular canvas:
        // 0, 0 is right in the middle, and its y-axis is FLIPPED
        // So we need to do some translation math
        particle.position.x = particles[i][0] - ( renderer.domElement.width / 2 );
        particle.position.y = ( 34 - particles[i][1] ) + ( renderer.domElement.height / 2 );

        particle.position.z = Math.round( ( Math.random() * 100 ) - 50 );
        particle.scale.x = 4;
        particle.scale.y = 4;
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
}

function draw( ctx ) {

    // Set the width of the FED Logo
    var desiredWidth = ( ctx.canvas.width - 100 ),
        scale = desiredWidth / fedLogo.width;

    // Erase the canvas
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

    ctx.save();

    // Set the fill color
    ctx.fillStyle = 'hsla( ' + fillHue + ', 50%, 50%, 1 )';

    // Center the FED Logo
    fedLogo.x = ( ctx.canvas.width / 2 ) - ( ( fedLogo.width * scale ) / 2 );
    fedLogo.y = ( ctx.canvas.height / 2 ) - ( ( fedLogo.height * scale ) / 2 );
    ctx.translate( fedLogo.x, fedLogo.y ); 

    // Resize the FED Logo
    ctx.scale( scale, scale );

    // Draw the FED Logo
    fedLogo.render( ctx );

    ctx.fill();
    ctx.restore();

    updateColor();

}

var fedLogo = {
    height: 68,
    width: 289,
    x: 0,
    y: 0,
    render: function( ctx ) {

        // Created with Ai->Canvas Export Plug-In Version 1.0 (Mac)
        // By Mike Swanson (http://blogs.msdn.com/mswanson/)
        // and MIX Online  (http://visitmix.com/)

        // Overall dimensions are 289 x 68

        ctx.beginPath();

        ctx.moveTo(260.9, 0.0);
        ctx.lineTo(195.0, 0.0);
        ctx.lineTo(195.0, 39.6);
        ctx.lineTo(207.0, 39.6);
        ctx.lineTo(207.0, 12.0);
        ctx.lineTo(260.9, 12.0);
        ctx.bezierCurveTo(269.3, 12.0, 276.1, 18.8, 276.1, 27.2);
        ctx.lineTo(276.1, 40.5);
        ctx.bezierCurveTo(276.1, 48.9, 269.3, 55.7, 260.9, 55.7);
        ctx.lineTo(201.0, 55.7);
        ctx.lineTo(201.0, 55.7);
        ctx.lineTo(120.8, 55.7);
        ctx.bezierCurveTo(112.4, 55.7, 105.6, 48.9, 105.6, 40.5);
        ctx.lineTo(105.6, 39.6);
        ctx.lineTo(186.6, 39.6);
        ctx.lineTo(186.7, 32.5);
        ctx.lineTo(186.7, 27.2);
        ctx.bezierCurveTo(186.7, 12.2, 174.5, 0.0, 159.5, 0.0);
        ctx.lineTo(120.8, 0.0);
        ctx.bezierCurveTo(105.8, 0.0, 93.6, 12.2, 93.6, 27.2);
        ctx.lineTo(93.6, 27.6);
        ctx.lineTo(12.0, 27.6);
        ctx.lineTo(12.0, 27.2);
        ctx.bezierCurveTo(12.0, 20.2, 16.8, 14.2, 23.4, 12.5);
        ctx.bezierCurveTo(24.6, 12.2, 25.9, 12.0, 27.2, 12.0);
        ctx.lineTo(87.1, 12.0);
        ctx.lineTo(87.1, 0.0);
        ctx.lineTo(27.2, 0.0);
        ctx.bezierCurveTo(15.0, 0.0, 4.7, 8.0, 1.2, 19.1);
        ctx.bezierCurveTo(0.4, 21.7, 0.0, 24.4, 0.0, 27.2);
        ctx.lineTo(0.0, 53.9);
        ctx.lineTo(0.0, 67.9);
        ctx.lineTo(12.0, 67.9);
        ctx.lineTo(12.0, 39.6);
        ctx.lineTo(30.6, 39.6);
        ctx.lineTo(30.6, 39.6);
        ctx.lineTo(93.6, 39.6);
        ctx.lineTo(93.6, 40.5);
        ctx.bezierCurveTo(93.6, 55.6, 105.8, 67.7, 120.8, 67.7);
        ctx.lineTo(260.9, 67.7);
        ctx.bezierCurveTo(275.9, 67.7, 288.1, 55.6, 288.1, 40.5);
        ctx.lineTo(288.1, 27.2);
        ctx.bezierCurveTo(288.1, 12.2, 275.9, 0.0, 260.9, 0.0);
        ctx.closePath();

        // layer1/Compound Path/Path
        ctx.moveTo(105.6, 27.2);
        ctx.bezierCurveTo(105.6, 18.8, 112.4, 12.0, 120.8, 12.0);
        ctx.lineTo(159.5, 12.0);
        ctx.bezierCurveTo(167.9, 12.0, 174.7, 18.8, 174.7, 27.2);
        ctx.lineTo(174.7, 27.6);
        ctx.lineTo(105.6, 27.6);
        ctx.lineTo(105.6, 27.2);
        ctx.closePath();

    }
}

function drawParticles( ctx, particles ) {

    // Erase the canvas
    ctx.clearRect( 0, 0, $parent.width(), $parent.height() );

    ctx.save();
    ctx.fillStyle = 'hsla( ' + fillHue + ', 50%, 50%, 1 )';

    for ( var i = 0, length = particles.length; i < length; i += 1 ) {
        var x = particles[i][0],
            y = particles[i][1];
            // z = particles[i].push( Math.round( ( Math.random() * 5 ) ) ) || particles[i][2];
            // zDelta = Math.round( ( Math.random() * 5 ) );
            // distance = Math.sqrt( Math.pow( mouseX - x, 2 ) + Math.pow( mouseY - y, 2 ) );
            // distance = Math.sqrt( Math.pow( ( window.innerWidth / 2 ) - x, 2 ) + Math.pow( ( window.innerHeight / 2 ) - y, 2 ) );

        ctx.save();
        ctx.fillStyle = 'hsla( ' + ( fillHue + Math.random() * 50 - 25 % 360 ) + ', 50%, 50%, 1 )';

        ctx.beginPath();
        ctx.arc( x, y, 4, 0, Math.PI * 2, true );
        ctx.fill();
        ctx.restore();
    }

    ctx.restore();

    updateColor();
    
}

function updateColor() {
    fillHue += 1;

    if ( fillHue > 360 ) {
        fillHue = 0;
    }
}

function onMouseMove( event ) {
    // store the mouseX and mouseY position
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function particleize( ctx, space ) {
    var points = [],
        space = space || 5;

    for ( var i = 0, width = ctx.canvas.width; i <= width; i += space ) {
        for ( var j = 0, height = ctx.canvas.height; j <= height; j += space ) {
        
            var data = ctx.getImageData( i, j, 1, 1 ).data;

            if ( data[0] !== 0 || data[1] !== 0 || data[2] !== 0 ) { 
                points.push([
                    i,
                    j
                ]);
            }

        }
    }

    // console.log( ctx.getImageData( 200, 200, 1, 1 ) );

    // console.log( 'Points:', points );
    return points;
}

$( document ).ready(function() {
    init();
});

})();

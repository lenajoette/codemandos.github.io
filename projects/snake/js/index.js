var app = new PIXI.Application( window.innerWidth, window.innerHeight, {
    backgroundColor: 0x1099bb
} );
document.body.appendChild( app.view );
app.autoResize = true;


var graphics = new PIXI.Graphics();
app.stage.addChild( graphics );


var score = new PIXI.Text( 0, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xFFFFFF,
} );

score.position.x = window.innerWidth / 2;
app.stage.addChild( score );
score.anchor.set( .5, 0 );


var wallBoxes = [];
var foodBoxes = [];
var playerBoxes = [];


var boxesDimension;

addWallBoxes();

initializePlayerBox();

var playerLastDirection = "left";
var playerLengthORIGINAL = 3;
var playerLength = playerLengthORIGINAL;

var playerSpeed = 2;

app.ticker.add( function( delta ) {

    graphics.clear();

    switch ( playerLastDirection ) {
        case "up":
            playerBoxes[ 0 ][ 1 ] -= playerSpeed;
            break;
        case "down":
            playerBoxes[ 0 ][ 1 ] += playerSpeed;
            break;
        case "left":
            playerBoxes[ 0 ][ 0 ] -= playerSpeed;
            break;
        case "right":
            playerBoxes[ 0 ][ 0 ] += playerSpeed;
            break;
    }
    drawBoxes();
} );


function addFood() {
    addNewFoodBox();
}
setInterval( addFood, 4000 );

function addNewFoodBox() {
    var newBox = [ Math.floor( Math.random() * ( window.innerWidth - 3 * boxesDimension ) ) + boxesDimension, Math.floor( Math.random() * ( window.innerHeight - 3 * boxesDimension ) ) + boxesDimension, boxesDimension, 0x00ff47 ];
    foodBoxes.push( newBox );
}

function createBox( x, y, size, color ) {
    var box = [ x, y, size, color ];
    wallBoxes.push( box );
}

function addWallBoxes() {

    var numberOfYBoxes = 35;
    boxesDimension = window.innerHeight / numberOfYBoxes;
    var numberOfXBoxes = window.innerWidth / boxesDimension - 1;

    for ( i = 0; i < numberOfYBoxes; i++ ) {
        createBox( 0, i * boxesDimension, boxesDimension, 0xff0000 );
        createBox( window.innerWidth - boxesDimension, i * boxesDimension, boxesDimension, 0xff0000 );
    }

    for ( i = 0; i < numberOfXBoxes; i++ ) {
        createBox( boxesDimension + i * boxesDimension, 0, boxesDimension, 0xff0000 );
        createBox( boxesDimension + i * boxesDimension, window.innerHeight - boxesDimension, boxesDimension, 0xff0000 );
    }
}

function drawBoxes() {
    for ( i = 0; i < wallBoxes.length; i++ ) {

        graphics.beginFill( wallBoxes[ i ][ 3 ] );
        graphics.drawRect( wallBoxes[ i ][ 0 ], wallBoxes[ i ][ 1 ], wallBoxes[ i ][ 2 ], wallBoxes[ i ][ 2 ] );
        graphics.endFill();

        if ( checkBoxCollision( playerBoxes[ 0 ], wallBoxes[ i ] ) ) {
            die();
        }
    }

    for ( i = 0; i < playerBoxes.length; i++ ) {
        graphics.beginFill( playerBoxes[ i ][ 3 ] );
        graphics.drawRect( playerBoxes[ i ][ 0 ], playerBoxes[ i ][ 1 ], playerBoxes[ i ][ 2 ], playerBoxes[ i ][ 2 ] );
        graphics.endFill();

        if ( checkBoxCollision( playerBoxes[ 0 ], playerBoxes[ i ] ) &&
            i > 0 && i < playerBoxes.length - 2 ) {
            die();
        }
    }

    for ( i = 0; i < foodBoxes.length; i++ ) {
        graphics.beginFill( foodBoxes[ i ][ 3 ] );
        graphics.drawRect( foodBoxes[ i ][ 0 ], foodBoxes[ i ][ 1 ], foodBoxes[ i ][ 2 ], foodBoxes[ i ][ 2 ] );
        graphics.endFill();

        if ( checkBoxCollision( playerBoxes[ 0 ], foodBoxes[ i ] ) ) {
            foodBoxes.splice( i, 1 );
            playerLength++;
            score.text = playerLength - playerLengthORIGINAL;
        }
    }

    if ( playerBoxes.length > 1 ) {
        var disX = playerBoxes[ playerBoxes.length - 1 ][ 0 ] - playerBoxes[ 0 ][ 0 ];
        var disY = playerBoxes[ playerBoxes.length - 1 ][ 1 ] - playerBoxes[ 0 ][ 1 ];
        var distance = Math.sqrt( disX * disX + disY * disY );
        if ( distance > boxesDimension ) {
            addNewPlayerBox();
        }
    } else {
        addNewPlayerBox();
    }

    if ( playerBoxes.length > playerLength ) {
        playerBoxes.splice( 1, 1 );
    }

}

function initializePlayerBox() {
    playerBoxes = [
        [ window.innerWidth / 2, window.innerHeight / 2, boxesDimension, 0x5437a4 ]
    ];
}

function addNewPlayerBox() {
    var newBox;
    newBox = [ playerBoxes[ 0 ][ 0 ], playerBoxes[ 0 ][ 1 ], boxesDimension, 0x5437a4 ];
    playerBoxes.push( newBox );
}

function die() {
    initializePlayerBox();
    foodBoxes = [];
    playerLength = playerLengthORIGINAL;
    score.text = 0;
}


function checkBoxCollision( b1, b2 ) {
    if ( b1[ 0 ] < b2[ 0 ] + boxesDimension &&
        b1[ 0 ] + boxesDimension > b2[ 0 ] &&
        b1[ 1 ] < b2[ 1 ] + boxesDimension &&
        b1[ 1 ] + boxesDimension > b2[ 1 ] ) {
        return true;
    } else {
        return false;
    }
}


document.addEventListener( 'keydown', onKeyDown );

function onKeyDown( e ) {
    switch ( e.keyCode ) {
        case 38:
            if ( playerLastDirection !== "down" ) {
                playerLastDirection = "up";
                addNewPlayerBox();
            }
            break;
        case 37:
            if ( playerLastDirection !== "right" ) {
                playerLastDirection = "left";
                addNewPlayerBox();
            }
            break;
        case 39:
            if ( playerLastDirection !== "left" ) {
                playerLastDirection = "right";
                addNewPlayerBox();
            }
            break;
        case 40:
            if ( playerLastDirection !== "up" ) {
                playerLastDirection = "down";
                addNewPlayerBox();
            }
            break;
        case 82:
            foodBoxes = [];
            initializePlayerBox();
            break;
    }
}

window.onresize = resize;

function resize() {
    wallBoxes = [];
    addWallBoxes();
    score.position.x = window.innerWidth / 2;
    app.renderer.resize( window.innerWidth, window.innerHeight );
    for ( i = 0; i < foodBoxes.length; i++ ) {
        if ( foodBoxes[ i ][ 0 ] > window.innerWidth ) {
            foodBoxes.splice( i, 1 );
        }
        if ( foodBoxes[ i ][ 1 ] > window.innerHeight ) {
            foodBoxes.splice( i, 1 );
        }
    }
}

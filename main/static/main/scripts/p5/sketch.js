var gravConst = 60;  // the gravity contstant increases the velocity speed

var attractor; // object which attracts particles
var attractorRange = 100;
var attractorMass = 30; // the size (ie. mass) of the attractor will effect the gravitational pull
var originMass = 75; // this value represents the gravitational pull when particle is returning to its origin (ie. the speed)

var particleArray = [];


var img;
var backgroundImg;
var pixelArray;

// Be sure to initialize a server in order to load image
function preload() {
  // backgroundImg = loadImage("images/background_image_alt.jpg", function() {
  //   console.log("load image success");
  // }, function() {
  //   console.log("load image failed");
  // });
  
  img = loadImage("static/main/scripts/p5/fox50.jpg", function() {
    console.log("load image success");
  }, function() {
    console.log("load image failed");
  });

}


function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent('homeSketchContainer');


  // background(backgroundImg); // make the background 100% opaque

  // loadPixels(); // must be called before accessing the pixels[] array

  // instantiate attractor object
  attractor = new Attractor(mouseX, mouseY, attractorMass);

  // build array of particle objects for each pixel in img
  // the gridx and gridy variables represent each pixel in the image
  // the posX and posY variables represent the position of the partical objects scaled to the canvas dimensions
  for (var gridX = 0; gridX < img.width; gridX++) {
    for (var gridY = 0; gridY < img.height; gridY++) {
      var tileWidth = width / img.width;
      var tileHeight = height / img.height;
      var posX = tileWidth * gridX;
      var posY = tileHeight * gridY;
      var pixelColor = img.get(gridX, gridY);
      var greyscale = round(red(pixelColor)*0.222 + green(pixelColor)*0.707 + blue(pixelColor)*0.071);
      // console.log(posX + ", " + posY + ": " + greyscale);
      var size = 0.75 * sqrt(tileWidth*tileWidth*(1-greyscale/255.0));
      particleArray.push(new Particle(posX, posY, size));
    }
  }
}



function draw() {

  fill(27, 31, 40);
  noStroke();
  rect(0, 0, width, height);

  attractor.location.x = mouseX;
  attractor.location.y = mouseY;
  // attractor.draw();

  // updating the particles
  for (var i = 0; i < particleArray.length; i++) {
    var particle = particleArray[i];

    // attract object if it is in given range of attractor
    if (particle.getDistanceFromAttractor(attractor) < attractor.range) {
      var force = attractor.attract(particle);
      particle.applyForce(force);
      particle.update();
      particle.draw();
    }

    if (particle.getDistanceFromAttractor(attractor) > attractor.range) {
      // particle.returnToOrigin();
      // particle.update();
      // particle.draw();



      // when particle.location it greater than 5px away from particle.origin
      if (particle.getDistanceFromOrigin() > 20) {
        // gradually return particle to its origin.
        particle.returnToOrigin();
        particle.update();
        particle.draw();
      } else {
        // when particle.location is within 5px of its .origin, set .location to .origin
        particle.velocity.set(0, 0);
        particle.location.set(particle.origin);
        particle.update();
        particle.draw();
      }

    }
  }
}





// *********************************************
//PARTICLE CLASS

function Particle(_locX, _locY, _size, _name) {
  this.name = _name;
  this.location = new p5.Vector(_locX, _locY);
  this.origin = new p5.Vector(_locX, _locY);
  this.velocity = new p5.Vector(0.0, 0.0);
  this.acceleration = new p5.Vector(0.0, 0.0);
  this.size = _size;


  this.draw = function() {
    //WHITE ELLIPSE
    if (this.size > 2.5) {
      fill(135, 205, 255);
      noStroke();
      ellipse(this.location.x, this.location.y, this.size, this.size);
    }
  }

  // Apply the given force returned from Attractor to the particles velocity
  this.applyForce = function(force) {
    this.velocity = force;
  }

  this.getDistanceFromAttractor = function(attractor) {
    var forceDirection = p5.Vector.sub(attractor.location, this.location);
    var distance = forceDirection.mag();
    return distance;
  }

  this.getDistanceFromOrigin = function() {
    var direction = p5.Vector.sub(this.origin, this.location);
    var distanceFromOrigin = direction.mag();
    return distanceFromOrigin;
  }

  this.returnToOrigin = function() {
    // calculations for objects distance
    var forceDirection = p5.Vector.sub(this.origin, this.location);
    var distance = forceDirection.mag();


    // the constrain() method will prevent unwanted effects when the object gets to close to the center of the attractor.
    distance = constrain(distance, 40, 300);

    // unsure what the pupurpose of normalize is, but it turns a vector into a number between 0.0 and 1.0 - kinda like map()
    forceDirection.normalize();

    // below is the equation for calculating the gravitational force of an object
    var magnitude = (gravConst * originMass * this.size) / (distance * distance);
    var force = forceDirection.mult(magnitude);

    this.velocity = force;
  }

  this.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
  }

}







// *********************************************
// ATTRACTOR CLASS

function Attractor(_locX, _locY, _size) {
  this.location = new p5.Vector(_locX, _locY);
  this.size = _size;
  this.range = attractorRange;

  this.draw = function() {
    fill(77, 0.2);
    stroke(255);
    ellipse(this.location.x, this.location.y, this.range*2, this.range*2);
    stroke(255);
    fill(44, 0.7);
    smooth();
    ellipse(this.location.x, this.location.y, this.size, this.size);
  }

  // Returns a Vector to be applied to the Particle location/veleocity
  this.attract = function(obj) {

    // calculations for objects distance
    var forceDirection = p5.Vector.sub(this.location, obj.location);
    var distance = forceDirection.mag();


    // the constrain() method will prevent unwanted effects when the object gets to close to the center of the attractor.
    distance = constrain(distance, 40, 300);

    // unsure what the pupurpose of normalize is, but it turns a vector into a number between 0.0 and 1.0 - kinda like map()
    forceDirection.normalize();

    // below is the equation for calculating the gravitational force of an object
    var magnitude = (gravConst * this.size * obj.size) / (distance * distance);
    var force = forceDirection.mult(magnitude);

    return force;  // p5.Vector
  }

}

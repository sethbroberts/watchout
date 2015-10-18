// start slingin' some d3 here.

var settings = {
  w: window.innerWidth,
  h: window.innerHeight,
  r: 30,
  n: 30,
  duration: 1500
};

var mouse = { x: settings.w/2, y: settings.h/2 };
var score = 0, highScore =0, collisionCount =0;

var pixelize = function (number) { return number + 'px'; };

var rand = function (n) { return Math.floor(Math.random()*n); };
var randX = function () { return pixelize (rand(settings.w-settings.r*2));};
var randY = function () { return pixelize (rand(settings.h-settings.r*2));};

var updateScore = function(){
  d3.select('.scoreboard .current span').text(score);
  d3.select('.scoreboard .highscore span').text(highScore);
  d3.select('.scoreboard .collisions span').text(collisionCount);
};

var board = d3.select('.board').style({
  width: pixelize( settings.w ),
  height: pixelize( settings.h )
});

d3.select('.mouse').style({
  top: pixelize(mouse.y),
  left: pixelize(mouse.x),
  width: pixelize(settings.r*2),
  height: pixelize(settings.r*2),
  'border-radius': pixelize(settings.r*2)
});

var asteroids = board.selectAll('.asteroids')
  .data(d3.range(settings.n))
  .enter().append('div')
  .attr('class', 'asteroid')
  .style({
    top: randX,
    left: randY,
    width: pixelize(settings.r*2),
    height: pixelize(settings.r*2)
  });

board.on('mousemove', function () {
  var loc = d3.mouse(this);
  mouse = { x: loc[0], y: loc[1] };
  d3.select('.mouse').style({
    top: pixelize(mouse.y-settings.r),
    left: pixelize(mouse.x-settings.r)
  })
});


var move = function (element) {
  element.transition().duration(settings.duration).style({
    top: randY,
    left: randX
  }).each('end', function () {
    move(d3.select(this));
  });
};
move(asteroids);
//don't use setInterval with transition
//each transition is event emitter, emits 'end'
//for every transition, create listener for end event
//then invoke move, but must specify object we want to move (to start a transition on)
//1st invocation: starts a transiton on an object containing 30 elements
//next invocaiton: transition invoked on each individual object


var scoreTicker = function(){
  score = score + 1;
  highScore = Math.max(score, highScore);
  updateScore();
};
setInterval(scoreTicker, 100); //can use setInterval here, not worried about timing

//need this b/c don't want to count collisions during all
//ticks when a collision is occuring
var prevCollision = false;
var detectCollisions = function () {

  var collision = false;

  asteroids.each(function () {
    var cx = this.offsetLeft + settings.r;    // what is offsetLeft and offsetRight
    var cy = this.offsetTop + settings.r;
    // the magic of mouse collision detection
    var x = cx - mouse.x;
    var y = cy - mouse.y;
    if ( Math.sqrt (x*x + y*y) < settings.r ) {
      collision = true;
    }
  });

  if (collision) {
    score = 0;
    //make a sound!!
    //make mouse element explode or flash
    if (prevCollision !== collision) {
      collisionCount = collisionCount + 1;
    }
  }
  prevCollision = collision;
};
//no other code can run during setInterval, so again don't use
d3.timer(detectCollisions);



/*
tweening is 'in-betweening'
calculating all in between functions
smoothing -- slower at begining and end
shape is determined by 'easing' function
default is 'cubic-in-out'; others include linear-in-out, elastic-in-out, bounce-in-out
could drop these options in:
  element.transition().duration(settings.duration).ease('elastic-in-out').style({...

*/






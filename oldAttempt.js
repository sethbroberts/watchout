// start slingin' some d3 here.


// start slingin' some d3 here.

// set up env
var body = d3.select("body");

var container = body.append('div').attr('class', 'container');


var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  high: 0,
  current: 0,
  collisions: 0
};

// set up game board
// axes
var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

// SVG game board
var gameBoard = container.append('svg:svg')   //container.append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);
// scores

var updateScore = function () {
  d3.select('.current').text(gameStats.current.toString());
};
// scores
var updateBestScore = function () {
  gameStats.high = Math.max(gameStats.high, gameStats.current);
  d3.select('.high').text(gameStats.high.toString());
};

// set up player

var Player = function () {
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';

  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.r = 5;

};
Player.prototype.constructor = function (gameOptions) {
  this.gameOptions = gameOptions;
};

//Player.prototype = Object.create(gameOptions);


Player.prototype.render = function (to) {
  this.el = to.append('svg:path').attr('d', this.path).attr('fill', this.fill);
  this.transform = {
    x: gameOptions.width * 0.5, //CHECK THIS
    y: gameOptions.height * 0.5
  };
  this.setupDragging();
  return this;
};

Player.prototype.getX = function () {
  return this.x;
};

Player.prototype.setX = function (x) {
  var minX = gameOptions.padding;
  var maxX = gameOptions.width - gameOptions.padding;
  x = Math.max(x, minX);
  x = Math.min(x, maxX);
  this.x = x;
};

Player.prototype.getY = function () {
  return this.y;
};
Player.prototype.setY = function (y) {
  var minY = gameOptions.padding;
  var maxY = gameOptions.height - gameOptions.padding;
  y = Math.max(y, minY);
  y = Math.min(y, maxY);
  this.y = y;
};

Player.prototype.transform = function (opts) {
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
};

Player.prototype.moveAbsolute = function (x, y) {
  this.transform({x: x, y: y});
};

Player.prototype.moveRelative = function (dx, dy) {
  //var context = this;
  this.transform({
    x: this.getX() + dx,
    y: this.getY() + dy,
    angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))
  });
};

Player.prototype.setupDragging = function () {
  var dragMove = this.moveRelative(d3.mouse.dx, d3.mouse.dy);
  var drag = d3.behavior.drag().on('drag', dragMove);
  this.el.call(drag);
};


var players = [];

players.push(new Player(gameOptions).render(gameBoard));
players.push(new Player(gameOptions).render(gameBoard));

// set up enemies

var createEnemies = function () {
  var results = [];
  for (var i = 0; i < gameOptions.nEnemies; i++) {
    results.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return results;
};

// render the game board


// var makeCoord = function (n) {
//   //input: number of random coordinates to make
//   //output: array of coordinates
//   var results = [];

//   var max = 300;

//   for (var i = 0; i < n; i++) {
//     results.push([Math.floor(Math.random() * max), Math.floor(Math.random() * max)])
//   }

//   return results;
// };

var render = function (enemy_data) {
  var enemies = gameBoard.selectAll('circle.enemy').data(enemy_data, function (d) {
    return d.id;
  });

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function (enemy) {
      return axes.x(enemy.x);
    })
    .attr('cy', function (enemy) {
      return axes.y(enemy.y);
    })
    .attr('r', 0);

  enemies.exit().remove();

  var checkCollision = function (enemy, collidedCallback) {
    players.forEach(function (player) {
      var radiusSum = parseFloat(enemy.attr('r')) + player.r;
      var xDiff = parseFloat(enemy.attr('cx')) - player.x;
      var yDiff = parseFloat(enemy.attr('cy')) - player.y;

      var seperation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (seperation < radiusSum) {
        collidedCallback(player, enemy);
      }
    });
  };

  var onCollision = function () {
    updateBestScore();
    gameStats.current = 0;
    updateScore();
  };

  var tweenWithCollisionDetection = function (endData) {
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };
    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return function (t) {
      checkCollision(enemy, onCollision);

      var enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };

      enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);

    };

    enemies
      .transition()
      .duration(500)
      .attr('r', 10)
      .transition
      .duration(2000)
      .tween('custom', tweenWithCollisionDetection);
  };
};


// now play
var play = function () {
  var gameTurn = function () {
    var newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  };

  var increaseScore = function () {
    gameStats.current++;
    updateScore();
  };

  gameTurn();
  setInterval(gameTurn, 2000);

  setInterval(increaseScore, 50);

};

play();



/*
 // create an asteroid image
 var _3body = d3.select("body");

 var _3svg = _3body.append("svg")
 .attr("width", 100)
 .attr("height", 100)
 .attr("xmlns", "http://www.w3.org/2000/svg");

 _3svg.append("image")
 .attr("xlink:href", "asteroid.png")
 .attr("width", 100)
 .attr("height", 100);
 */










/*
 var gameData = {
 asteroidCount: 10,
 highScore: 0,
 currentScore: 0,
 collisions: 0
 };

 var gameOptions = {
 height: 450,
 width: 700,
 nEnemies: 30,
 padding: 20
 };

 // game

 var body = d3.select("body");

 var gameBoard = body.append("div")
 .attr("width", 800)
 .attr("height", 500)
 .attr("class", "board")
 .append("rect")
 .attr("width", 800)
 .attr("height", 500)
 .style({
 "fill": "green",
 "stroke-width": 3,
 "stroke": "black"
 });


 var renderAsteroids = function (count) {

 for (var i = 0; i < count; i++) {
 d3.select(".gameBoard").append("svg")
 .attr("width", 50)
 .attr("height", 50)
 .attr("viewBox", "0 0 100 100")
 .append("image")
 .attr("xlink:href", "asteroid.png")
 .attr("width", 50)
 .attr("height", 50);
 }
 };

 renderAsteroids(gameOptions.enemies);


 var createEnemies = function () {
 var results = [];
 for (var i = 0; i < gameOptions.nEnemies; i++) {
 results.push({
 id: i,
 x: Math.random() * 100,
 y: Math.random() * 100
 });
 }
 return results;
 };


 //  <svg width="100%" height="100%" viewBox="0 0 100 100"
 //xmlns="http://www.w3.org/2000/svg"
 //xmlns:xlink="http://www.w3.org/1999/xlink">
 //  <image xlink:href="/files/2917/fxlogo.png" x="0" y="0" height="100" width="100" />
 //  </svg>


 //var player;


 //{stroke: "black", "stroke-width": "2px"}


 //var svgSelection = bodySelection.append("svg")
 //4                                .attr("width", 50)
 //5                                .attr("height", 50);
 //6


 //<svg width="400" height="110">
 //  <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
 //</svg>
 */

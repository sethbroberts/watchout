// start slingin' some d3 here.

//make new coordinates
var makeCoord = function (n) {
  //input: number of random coordinates to make
  //output: array of coordinates
  var results = [];

  for (var i = 0; i < n; i++) {
    results.push({
      id: i,
      x: Math.floor(Math.random() * (700 - 20)),
      y: Math.floor(Math.random() * (450 - 20))
    });
  }

  return results;
};

var margin = {top: -5, right: -5, bottom: -5, left: -5},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var gameOptions = {   //took out height and width properties
  nEnemies: 30,
  padding: 20,
  asteroidSize: 20
};

var gameData = {
  asteroidCount: 1,
  highScore: 0,
  currentScore: 0,
  collisions: 0
};

var drag = d3.behavior.drag()
  .origin(function (d) {
    return d;
  })
  .on("dragstart", dragstarted)
  .on("drag", dragged)
  .on("dragend", dragended);


var highScore = d3.selectAll('.high');
highScore.data(['high score goes here'])
  .select('span')
  .text(function (d) {
    return d
  });

var currentScore = d3.selectAll('.current');
currentScore.data(['current score goes here'])
  .select('span')
  .text(function (d) {
    return d
  });

var collisions = d3.selectAll('.collisions');
collisions.data(['collisions go here'])
  .select('span')
  .text(function (d) {
    return d
  });


var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var container = svg.append("g");


var newCoord = makeCoord(1);
dot = container.append("g")
  .attr("class", "player")
  .selectAll("circle")
  .data(newCoord)
  .enter().append("circle")
  .style({
    "fill": "yellow",
    "stroke": "black"
  })
  .attr("r", 5)
  .attr("cx", function (d) {
    return d.x;
  })
  .attr("cy", function (d) {
    return d.y;
  })
  .call(drag);

var newCoord = makeCoord(gameData.asteroidCount);
dot = container.append("g")
  .selectAll("circle")
  .data(newCoord)
  .enter().append("circle")
  .attr("class", "asteroid")
  .attr("r", 5)
  .attr("cx", function (d) {
    return d.x;
  })
  .attr("cy", function (d) {
    return d.y;
  });

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}
//replace setInterval with timer??
//move asteroids
setInterval(function () {
  //try to get mouse x, y
  //var pla = d3.select('.player');
  //console.log(pla);
  newCoord = makeCoord(gameData.asteroidCount);
  var thisAsteroid = d3.selectAll('.asteroid')
    .data(newCoord)
    .transition().duration(1000)              //
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
  console.log(thisAsteroid);

}, 2000);


//collision checker
setInterval(function () {
  var player = d3.select('.player');
  var playerData = player.select('circle');
  var playerX = playerData.attr('cx');
  var playerY = playerData.attr('cy');
  //console.log(playerData.attr('cx'), playerData.attr('cy'));
  var asteroids = d3.select('.asteroid');
  for (var i = 0; i < asteroids.length; i++) {
    //console.log(asteroids[i][0].__data__.x);
    //var asteroidData = asteroids[i].select('circle');

    var asteroidX = asteroids[i][0].__data__.x;
    var asteroidY = asteroids[i][0].__data__.y;

    var distance = Math.sqrt(Math.pow((playerX - asteroidX), 2) + Math.pow((playerY - asteroidY), 2));
    //console.log(distance);
    if (distance < 10) {
      console.log('hit!');
    }


  }
}, 5);

/*
 var circle1 = {radius: 20, x: 5, y: 5};
 var circle2 = {radius: 12, x: 10, y: 5};

 var dx = circle1.x - circle2.x;
 var dy = circle1.y - circle2.y;
 var distance = Math.sqrt(dx * dx + dy * dy);

 if (distance < circle1.radius + circle2.radius) {
 // collision detected!
 }
 */

//==========================================================================
//old code

// //game board
// var svg = d3.select("body").append("svg")
//   .attr("width", gameOptions.width + gameOptions.marginLeft + gameOptions.marginRight)
//   .attr("height", gameOptions.height + gameOptions.marginTop + gameOptions.marginBottom)
//   .append("g")
//   .attr("transform", "translate(" + gameOptions.marginLeft + "," + gameOptions.marginRight + ")");

// var gameBoard = d3.select('body').append('div')
//   .attr('class', 'gameBoard')
//   .style('height', String(gameOptions.height) + 'px')
//   .style('width', String(gameOptions.width) + 'px')
//   .style('background-color', 'black')
//   .style('position', 'relative');


// //asteroids
// var newCoord = makeCoord(gameData.asteroidCount);
// d3.select('.gameBoard').selectAll('div')
//   .data(newCoord)
//   .enter()
//   .append('div')
//   .attr('class', 'asteroid')
//   .style('position', 'absolute')
//   .style('left', function (d) {
//     return String(d.x) + 'px'
//   })
//   .style('top', function (d) {
//     return String(d.y) + 'px'
//   })
//   .style('background-color', 'red')
//   .style('width', String(gameOptions.asteroidSize) + 'px')
//   .style('height', String(gameOptions.asteroidSize) + 'px')
//   .style('border-radius', String(gameOptions.asteroidSize) + 'px');


// //drag behavior
// var drag = d3.behavior.drag()
//   .origin(function (d) {
//     return d;
//   })
//   .on("dragstart", dragstarted)
//   .on("drag", dragged)
//   .on("dragend", dragended);
// function dragstarted(d) {
//   d3.event.sourceEvent.stopPropagation();
//   d3.select(this).classed("dragging", true);
// }
// function dragged(d) {
//   d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
// }
// function dragended(d) {
//   d3.select(this).classed("dragging", false);
// }

// //player
// var playerCoord = makeCoord(1);
// var player = d3.select('.gameBoard').selectAll('span')
//   .data(playerCoord)
//   .enter()
//   .append('span')
//   .attr('class', 'asteroid')
//   .style('position', 'absolute')
//   .style('left', function (d) {
//     return String(d.x) + 'px'
//   })
//   .style('top', function (d) {
//     return String(d.y) + 'px'
//   })
//   .style('background-color', 'blue')
//   .style('width', String(gameOptions.asteroidSize) + 'px')
//   .style('height', String(gameOptions.asteroidSize) + 'px')
//   .style('border-radius', String(gameOptions.asteroidSize) + 'px')
//   .call(drag);


// // Define drag beavior
// var drag = d3.behavior.drag()
//   .on("drag", dragmove);

// function dragmove(d) {
//   var x = d3.event.x;
//   var y = d3.event.y;
//   d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
// }


//==========================================================================
//super old code


// function mousemove() {
//   // Ignore the click event if it was suppressed
//   if (d3.event.defaultPrevented) return;

//   // Extract the click location\
//   var point = d3.mouse(this);
//   console.log(point[0], point[1]);
// }


// game

// var body = d3.select("body");

// var gameBoard = body.append("div")
//   .attr("width", 800)
//   .attr("height", 500)
//   .attr("class", "board")
//   .append("rect")
//   .attr("width", 800)
//   .attr("height", 500)
//   .style({
//     "fill": "green",
//     "stroke-width": 3,
//     "stroke": "black"
//   });


//MAKE A BUNCH OF ASTEROIDS
//make a bunch of divs
//assign an image and coordinates to each

//MAKE A FUNCTION TO UPDATE POSITIONS
//spits out new coordinates
//do a transition

//make an array of random coordinates

// var makeCoord = function (n) {
//   //input: number of random coordinates to make
//   //output: array of coordinates
//   var results = [];

//   var max = 300;

//   for (var i=0; i<n; i++) {
//     results.push([Math.floor(Math.random()*max), Math.floor(Math.random()*max)])
//   }

//   return results;
// }

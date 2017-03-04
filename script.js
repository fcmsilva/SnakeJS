$(document).ready(function() {
  var table = [];
  var width = 20;
  var height = 15;
  var foodLoc = [];
  var startSize = 2;
  var minColor=60;
  var maxColor=150;
  
  var gg = false;
  var baseFrameRate = 200;
  var minFrameRate = 100;
  var frameRate = baseFrameRate;
  var decrement = 20;

  var loop;

  var html = "";
  for (var y = 0; y < height; y++) {
    html += "<div class='col' id ='col-" + y + "'>";
    table[y] = [];
    for (var x = 0; x < width; x++) {
      table[y][x] = 0;
      html += "<div class='pixel pixel-" + x + "'></div>";
    }
    html += "</div>";
  }
  document.getElementById('game').innerHTML = html;

  function randBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  var snake = {
    locations: [
      []
    ],
    direction: [1, 0],
    directionTxt: function() {
      var x = this.direction[0];
      var y = this.direction[1];
      if (x == 1 && y == 0) {
        return "r";
      } else if (x == 0 && y == -1) {
        return "u";
      } else if (x == -1 && y == 0) {
        return "l";
      } else if (x == 0 && y == 1) {
        return "d";
      }
    }
  }

  function createFood() {
    console.log('createFood');
    elemAt(foodLoc[0], foodLoc[1]).removeClass('food');
    var x = randBetween(0, width - 1);
    var y = randBetween(0, height - 1);
    console.log(isSnaked(x,y));
    while (isSnaked(x, y)) {
      x = randBetween(0, width - 1);
      y = randBetween(0, height - 1);
    }
    console.log(x+"/"+(width-1)+" | "+y+"/"+(height-1));
    foodLoc = [x, y];
    elemAt(x, y).addClass('food');
  }

  function elemAt(x, y) {
    return $("#game #col-" + y + " .pixel-" + x)
  }
  

  function colorBlock(x, y,color) {
    var col = (color==undefined ? maxColor : color);
    elemAt(x, y).addClass('active').css("background","rgb("+col+","+col+","+col+")");
    
  }

  function removeBlock(x, y) {
    elemAt(x, y).removeClass('active').css("background","transparent");
  }

  function isOverBoard() {
    var curr = snake.locations[0];
    return (curr[0] < 0 || curr[0] >= width || curr[1] < 0 || curr[1] >= height);
  }

  function isSnaked(x, y) {
    var found = false;
    for (var i = 0; i < snake.locations.length; i++) {
      var loc = snake.locations[i];
      if (loc[0] == x && loc[1] == y) {
        found = true;
      }
    }
    return found;
  }

  function isEating() {
    var curr = snake.locations[0];
    return curr[0] === foodLoc[0] && curr[1] === foodLoc[1];
  }

  function updateSnake() {
    $(".pixel").removeClass('active').css("background","gainsboro");

    var snakeLength = snake.locations.length;
    for (var i = 0; i < snakeLength; i++) {
      var color = Math.floor((i/(snakeLength-1))*minColor+(maxColor-minColor));

      var currPos = snake.locations[i];
      colorBlock(currPos[0], currPos[1],color);
    }
  }

  function start() {
    $("#msg").hide();
    $("#startover").hide();
    frameRate = baseFrameRate;
    snake.direction = [1,0];
    gg = false;
    snake.locations = [
      []
    ];
    var starterX = randBetween(7, width - 7);
    var starterY = randBetween(7, height - 7);
    snake.locations.unshift([starterX, starterY]);
    snake.locations.push([starterX - 1, starterY]);
    createFood();
    move();
  }

  function end() {
    clearInterval(loop);
    gg = true;
    $("#startover").show();
    $("#msg").show();
    console.log("Bye");
  }

  function move() {
    clearInterval(loop);
    loop = setInterval(move, frameRate);
    var currPos = snake.locations[0];
    var xDir = snake.direction[0];
    var yDir = snake.direction[1];
    var nextPos = [currPos[0] + xDir, currPos[1] + yDir];

    if (!isSnaked(nextPos[0], nextPos[1]) && !gg) {
      snake.locations.unshift(nextPos);
      if (!isOverBoard()) {
        if (!isEating()) {
          snake.locations.pop();
        } else {
          if (frameRate > 100) {
            frameRate -= decrement;
          }
          createFood();
        }
        updateSnake();
      } else {
        end();
      }
    } else {
      end();

    }
  }

  start();
  $(document).keyup(function(e) {
    if (e.which === 38) {
      //up was pressed
    }
  });
  document.onkeydown = function myFunction() {
    switch (event.keyCode) {
      case 38:
        if (snake.directionTxt() != "d" && snake.directionTxt() != "u") {
          snake.direction = [0, -1];
          move();
        }
        console.log("Up")
        break;
      case 40:
        if (snake.directionTxt() != "u" && snake.directionTxt() != "d") {
          snake.direction = [0, 1];
          move();
        }
        console.log("Down");
        break;
      case 39:
        if (snake.directionTxt() != "l" && snake.directionTxt() != "r") {
          snake.direction = [1, 0];
          move();
        }
        console.log("Right");
        break;
      case 37:
        if (snake.directionTxt() != "r" && snake.directionTxt() != "l") {
          snake.direction = [-1, 0];
          move();
        }
        console.log("Left");

        break;
    }
  }
  $("#startover").click(function() {
    start();
  })

});
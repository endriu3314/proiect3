let canvas,
  ctx,
  apple_x,
  apple_y,
  bomb_x,
  bomb_y,
  go_left = false,
  go_right = true,
  go_up = false,
  go_down = false,
  snake_length,
  alive = true,
  bomb_count = 0,
  bomb_time_remaining = 0;

/* const CANVAS_HEIGHT = document.documentElement.clientHeight - 10;
const CANVAS_WIDTH = document.documentElement.clientWidth - 10; */
const CANVAS_HEIGHT = 300;
const CANVAS_WIDTH = 300;
const DOT_SIZE = 10;
const MAX_DOTS = Math.round(
  (CANVAS_HEIGHT * CANVAS_WIDTH) / (DOT_SIZE * DOT_SIZE)
);
const MAX_RAND = generateMaxRand();
const GAME_LOOP_DELAY = 100;

const BOMB_RADIUS = 10;
const BOMB_LOOP_DELAY = 5000;

let x_snake = new Array(MAX_DOTS);
let y_snake = new Array(MAX_DOTS);

window.onload = () => {
  init();
};

function generateMaxRand() {
  if (CANVAS_HEIGHT / DOT_SIZE > CANVAS_WIDTH / DOT_SIZE)
    return CANVAS_WIDTH / DOT_SIZE;
  else return CANVAS_HEIGHT / DOT_SIZE;
}

function dom(tag, text) {
  let r = document.createElement(tag);
  if (text) r.innerText = text;
  return r;
}

function append(parent, child) {
  parent.appendChild(child);
  return parent;
}

//redefined timeout for bomb countdown
(function () {
  var nativeSetTimeout = window.setTimeout;

  window.bindTimeout = function (listener, interval) {
    function setTimeout(code, delay) {
      var elapsed = 0,
        h;

      h = window.setInterval(function () {
        elapsed += interval;
        if (elapsed < delay) {
          listener(delay - elapsed);
        } else {
          window.clearInterval(h);
        }
      }, interval);
      return nativeSetTimeout(code, delay);
    }

    window.setTimeout = setTimeout;
    setTimeout._native = nativeSetTimeout;
  };
})();

const init = () => {
  canvas = dom('CANVAS');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  ctx = canvas.getContext('2d');

  append(document.body, canvas);

  generateSnake();
  generateApple();
  draw();

  bombLoop();
  gameLoop();
};

const gameLoop = () => {
  if (alive == true) {
    moveSnake();
    checkCollision();
    checkAppleCollision();
    draw();
    console.log('gameloop');
    setTimeout('gameLoop()', GAME_LOOP_DELAY);

    document.addEventListener('keydown', setMovement);
  }
};

const bombLoop = () => {
  if (alive == true) {
    bombExplosion();
    setTimeout('bombLoop()', BOMB_LOOP_DELAY);
    window.bindTimeout(function (t) {
      bomb_time_remaining = t;
    }, GAME_LOOP_DELAY);
    window.setTimeout(function (t) {
      console.log(t + 'All done.');
    }, BOMB_LOOP_DELAY);
  }
};

const draw = () => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.style.border = '1px solid #000000';

  if (alive == true) {
    //draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple_x, apple_y, DOT_SIZE, DOT_SIZE);

    //draw snake
    for (let i = 0; i < snake_length; i++) {
      if (i == 0) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x_snake[i], y_snake[i], DOT_SIZE, DOT_SIZE);
      } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(x_snake[i], y_snake[i], DOT_SIZE, DOT_SIZE);
      }
    }

    //draw bomb
    for (
      let i = bomb_x - BOMB_RADIUS;
      i < bomb_x + BOMB_RADIUS + 1;
      i = i + DOT_SIZE
    ) {
      for (
        let j = bomb_y - BOMB_RADIUS;
        j < bomb_y + BOMB_RADIUS + 1;
        j = j + DOT_SIZE
      ) {
        if (i == bomb_x && j == bomb_y) {
          ctx.fillStyle = 'rgba(255, 215, 0, 1)';
          ctx.fillRect(i, j, DOT_SIZE, DOT_SIZE);
        } else {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
          ctx.fillRect(i, j, DOT_SIZE, DOT_SIZE);
        }
      }
    }

    //bomb timer
    ctx.fillStyle = 'blue';
    ctx.textBaseline = 'middle';
    ctx.font = 'normal bold 18px serif';

    ctx.fillText('Bomb timer: ' + bomb_time_remaining, CANVAS_WIDTH - 150, 18);
  } else {
    endGame();
  }
};

const generateSnake = () => {
  snake_length = 3;

  for (let i = 0; i < snake_length; i++) {
    x_snake[i] = 50 - i * DOT_SIZE;
    y_snake[i] = 50 - i * DOT_SIZE;
  }
};

const moveSnake = () => {
  //move body
  for (let i = snake_length; i > 0; i--) {
    x_snake[i] = x_snake[i - 1];
    y_snake[i] = y_snake[i - 1];
  }

  //move head
  if (go_left == true) {
    x_snake[0] = x_snake[0] - DOT_SIZE;
  } else if (go_right == true) {
    x_snake[0] = x_snake[0] + DOT_SIZE;
  } else if (go_up == true) {
    y_snake[0] = y_snake[0] + DOT_SIZE;
  } else if (go_down == true) {
    y_snake[0] = y_snake[0] - DOT_SIZE;
  }
};

const checkCollision = () => {
  for (let i = snake_length; i > 0; i--) {
    if (
      snake_length > 4 &&
      x_snake[i] == x_snake[0] &&
      y_snake[i] == y_snake[0]
    ) {
      console.log('snake died at ', x_snake[0], y_snake[0]);
      alive = false;
    }
  }

  if (
    x_snake[0] == CANVAS_WIDTH ||
    y_snake[0] == CANVAS_HEIGHT ||
    x_snake[0] == 0 ||
    y_snake[0] == 0
  ) {
    alive = false;
  }
};

const setMovement = (e) => {
  switch (e.keyCode) {
    case 37:
      go_left = true;
      go_right = false;
      go_up = false;
      go_down = false;
      break;

    case 38:
      go_up = false;
      go_down = true;
      go_left = false;
      go_right = false;
      break;

    case 39:
      go_right = true;
      go_left = false;
      go_down = false;
      go_up = false;
      break;

    case 40:
      go_down = false;
      go_up = true;
      go_left = false;
      go_right = false;
      break;
  }
};

const generateApple = () => {
  apple_x =
    Math.ceil(
      Math.floor(Math.random() * Math.floor(CANVAS_WIDTH - DOT_SIZE)) / DOT_SIZE
    ) * 10;
  apple_y =
    Math.ceil(
      Math.floor(Math.random() * Math.floor(CANVAS_HEIGHT - DOT_SIZE)) /
        DOT_SIZE
    ) * 10;

  for (i = 0; i < snake_length; i++) {
    if (apple_x == x_snake[i] && apple_y == y_snake[i]) {
      generateApple();
    }
  }

  console.log('apple', apple_x, apple_y);
};

const checkAppleCollision = () => {
  if (x_snake[0] == apple_x && y_snake[0] == apple_y) {
    snake_length = snake_length + 1;
    console.log('snake', x_snake[0], y_snake[0]);
    console.log('grow');
    generateApple();
  }
};

const generateBomb = () => {
  bomb_x =
    Math.ceil(
      Math.floor(
        Math.random() * Math.floor(CANVAS_WIDTH - DOT_SIZE * BOMB_RADIUS + 5)
      ) / DOT_SIZE
    ) * 10;
  bomb_y =
    Math.ceil(
      Math.floor(
        Math.random() * Math.floor(CANVAS_HEIGHT - DOT_SIZE * BOMB_RADIUS + 5)
      ) / DOT_SIZE
    ) * 10;

  for (i = 0; i < snake_length; i++) {
    if (bomb_x == x_snake[i] && bomb_y == y_snake[i]) {
      generateBomb();
    }
  }

  console.log('bomb', bomb_x, bomb_y);
};

const bombExplosion = () => {
  for (
    let i = bomb_x - BOMB_RADIUS;
    i < bomb_x + BOMB_RADIUS + 1;
    i = i + DOT_SIZE
  ) {
    for (
      let j = bomb_y - BOMB_RADIUS;
      j < bomb_y + BOMB_RADIUS + 1;
      j = j + DOT_SIZE
    ) {
      if (x_snake[0] == i && y_snake[0] == j) {
        alive = false;
        console.log('bomb', i, j, 'snake', x_snake[0], y_snake[0]);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.style.border = '1px solid #000000';

        endGame();
      }
    }
  }

  generateBomb();
};

const endGame = () => {
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = 'normal bold 18px serif';

  ctx.fillText('Game over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  /* let btn = dom('button');
  append(container, btn); */
};

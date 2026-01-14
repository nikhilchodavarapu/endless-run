import { createScreen, displayScreen, randomObstacle } from "./screen.js";

const placeObstacleInScreen = (screen, obstacle, currentCol, clear) => {
  const initCol = screen[0].length - obstacle[0].length - currentCol;
  if (initCol >= screen[0].length) return;
  let col = initCol;
  let row = screen.length - obstacle.length;
  for (let i = 0; i < obstacle.length; i++) {
    for (let j = 0; j < obstacle[i].length; j++) {
      screen[row][col] = !clear ? obstacle[i][j] : " ";
      col++;
    }
    col = initCol;
    row++;
  }
};

const placeDinoInScreen = async (dino, screen, pos, score) => {
  const [row, col] = pos;
  if (screen[row][col] !== " " && screen[row][col] !== "☠") {
    // console.log([screen[row][col]]);
    const file = await Deno.open("high-score.txt");
    const buffer = new Uint8Array(10);
    await file.read(buffer);
    const highScore = parseInt(new TextDecoder().decode(buffer));
    file.close();
    console.log("Score :", score);
    if (highScore < score) {
      console.log("High Score :", score);
      const file = await Deno.open("high-score.txt", {
        write: true,
        truncate: true,
      });
      const buffer = new TextEncoder().encode(score);
      file.write(buffer);
      file.close();
    } else {
      console.log("High Score :", highScore);
    }
    Deno.exit();
  }
  screen[row][col] = dino;
};

const getObstacles = () => {
  const obstacles = [];
  for (let i = 0; i <= 100; i++) {
    obstacles.push(randomObstacle());
  }
  return obstacles;
};

const placeAllObstaclesInScreen = (screen, obstacles, currentCol) => {
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    placeObstacleInScreen(screen, obstacle, (currentCol - i * 12) - 1, true);
    placeObstacleInScreen(screen, obstacle, currentCol - i * 12);
  }
};

const play = async () => {
  let score = 0;
  Deno.stdin.setRaw(true);
  const screen = createScreen();
  let i = 0;
  const dino = "☠";
  const obstacles = getObstacles();
  let jmp = false;
  setInterval(() => {
    if (!jmp) {
      placeDinoInScreen(dino, screen, [18, 25], score);
    }
    placeAllObstaclesInScreen(screen, obstacles, i);
    displayScreen(screen);
    console.log("Score :", score);
    i++;
    score++;
  }, 150 - i);
  const reader = Deno.stdin.readable.getReader();
  const [row, col] = [18, 25];
  try {
    while (true) {
      const key = await reader.read();
      if (new TextDecoder().decode(key.value) === "q") {
        Deno.exit();
      }
      if (jmp) {
        continue;
      }
      let i = 1;
      let inc = 1;
      const interval = setInterval(() => {
        placeDinoInScreen(" ", screen, [row - i + inc, col], score);
        placeDinoInScreen(dino, screen, [row - i, col], score);
        displayScreen(screen);
        i += inc;
        jmp = true;
        if (i === 5) {
          placeDinoInScreen(" ", screen, [row - i + inc, col], score);
          inc = -1;
        }
        if (i === 0) {
          jmp = false;
          clearInterval(interval);
          placeDinoInScreen(" ", screen, [row + inc, col], score);
        }
        score++;
      }, 150);
    }
  } finally {
    reader.releaseLock();
    Deno.stdin.setRaw(false);
  }
};

play();

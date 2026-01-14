export const createScreen = (width = 50, height = 20) => {
  const screen = Array.from(
    { length: height },
    (_) => Array.from({ length: width }, (_) => " "),
  );
  return screen;
};

const rectangleObstacle = () => {
  const height = Math.floor(Math.random() * 3) + 1;
  const obstacle = "┌──┐\n" + "│  │\n".repeat(height - 1); //+ "└──┘\n";
  return obstacle.split("\n").map((x) => x.split(""));
};

const triangleObstacle = () => {
  const height = Math.floor(Math.random() * 3) + 1;
  let obstacle = "";
  for (let i = 1; i <= height; i++) {
    obstacle += " ".repeat(height - i) + "╱" + " ".repeat((i - 1) * 2) + "╲\n";
  }
  return obstacle.split("\n").map((x) => x.split(""));
};

export const randomObstacle = () => {
  return [triangleObstacle(), rectangleObstacle()][Math.round(Math.random())];
};

export const displayScreen = (screen) => {
  console.clear();
  console.log("\x1b[1m" + screen.map((x) => x.join("")).join("\n"));
};

const game = document.querySelector(".game");
const DomPlayer = () => document.querySelector(".player");
const DomEnemies = () => document.querySelectorAll(".enemy");

const Setup = ({ w, h }) => {
  game.style.width = w;
  game.style.height = h;
};
Setup({ w: "100%", h: "100vh" });

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

var keysPressed = {};
var isStopped = true;
var isStoppedRight = true;
var isStoppedLeft = true;
var movetoRight;
var movetoLeft;
var moveLoop;
var isNotAttacking = true;
var movementFrame = 1;

// Enemy variables
var isStoppedEnemy = false;

const Enemy = () => {
  const enemy = new Image();
  enemy.src = "./sprites/1 Enemy/PNG/walk-1.png";
  enemy.style.position = "absolute";
  enemy.classList = "enemy";
  enemy.style.transform = "scaleX(-1)";

  const position = { x: getRandomInt(500, game.offsetWidth) + "px", y: 0 };
  const velocity = { x: 1, y: 3 };

  enemy.style.bottom = position.y;
  enemy.style.left = position.x;

  return {
    draw: () => game.appendChild(enemy),
    drawMovement: () => {
      DomEnemies().forEach((enemy) => {
        var EnemyWalk = setInterval(() => {
          if (
            enemy.offsetLeft - DomPlayer().offsetLeft + 31 < 1 &&
            isNotAttacking
          ) {
            DomPlayer().style.backgroundColor = "red";
            return clearInterval(EnemyWalk);
          }

          enemy.style.left = enemy.offsetLeft - velocity.x + "px";
          console.log("EnemyWalk interval still looping...");
        }, 1007);
      });
    },
  };
};

const Player = () => {
  const player = new Image();
  player.src = "./sprites/walk-with-weapon-1.png";
  player.style.position = "absolute";
  player.classList = "player";
  player.style.bottom = 0;

  const velocity = {
    x: 1,
    y: 7,
  };

  const jumpLevel = 51;

  return {
    attack: (e) => {
      if (isNotAttacking) {
        DomPlayer().src = "./sprites/attack-A5.png";

        isNotAttacking = false;
        if (isNotAttacking == false) {
          setTimeout(() => {
            DomPlayer().src = "./sprites/walk-with-weapon-1.png";
            isNotAttacking = true;
          }, 100);
        }
      }
    },
    drawMovement: () => {
      DomPlayer().src =
        "./sprites/walking/walk-with-weapon-" +
        Math.floor(Math.random() * (11 - 1) + 1) +
        "-trimmy.png";
    },
    move: (e) => {
      // Direita e esquerda
      if (
        (keysPressed[39] && keysPressed[37]) ||
        (keysPressed[68] && keysPressed[65])
      ) {
        clearInterval(moveToRight);
        clearInterval(moveToLeft);
        return;
      }

      // Direita + pulo;
      if (
        (keysPressed["39"] && keysPressed["32"]) ||
        (keysPressed["68"] && keysPressed["32"]) ||
        keysPressed["39"] ||
        keysPressed["68"]
      ) {
        DomPlayer().style.transform = "scaleX(1)";

        if (isStoppedRight) {
          isStoppedRight = false;

          moveToRight = setInterval(() => {
            DomPlayer().style.left = DomPlayer().offsetLeft + velocity.x + "px";
          }, 3);
        }
      }
      // Esquerda + pulo;
      if (
        (keysPressed["37"] && keysPressed["32"]) ||
        (keysPressed["65"] && keysPressed["32"]) ||
        keysPressed["37"] ||
        keysPressed["65"]
      ) {
        DomPlayer().style.transform = "scaleX(-1)";

        if (isStoppedLeft) {
          isStoppedLeft = false;

          moveToLeft = setInterval(() => {
            DomPlayer().style.left = DomPlayer().offsetLeft - velocity.x + "px";
          }, 3);
        }
      }

      // Pulo
      if (keysPressed[32]) {
        var jumpOffset = 0;

        if (isStopped && keysPressed[32]) {
          isStopped = false;

          const jump = setInterval(() => {
            if (jumpOffset > jumpLevel) {
              const drop = setInterval(() => {
                if (jumpOffset > -1 && jumpOffset < 1) {
                  isStopped = true;
                  DomPlayer().src = "./sprites/walk-with-weapon-1.png";
                  return clearInterval(drop);
                }

                jumpOffset--;
                DomPlayer().style.bottom = jumpOffset + "px";
              }, velocity.y);
              return clearInterval(jump);
            }

            DomPlayer().style.bottom = jumpOffset + "px";
            jumpOffset++;
          }, 3);
        }
      }
    },
    draw: () => game.appendChild(player),
    position: (x, y) => {},
  };
};

const Background = ({ image, color }) => {
  if (image) return (game.style.backgroundImage = `url(${image})`);
  else return (game.style.backgroundColor = color);
};

Player().draw();

const runGame = () => {
  Background({ color: "#2D0202" });
  window.addEventListener("keydown", (e) => {
    keysPressed[e.keyCode] = e.type == "keydown";
    // console.log(keysPressed);
    Player().move(e);
    Player().drawMovement();
  });
  window.addEventListener("keyup", (e) => {
    delete keysPressed[e.keyCode];

    if (e.keyCode == 39 || e.keyCode == 68) {
      DomPlayer().src = "./sprites/walk-with-weapon-1.png";
      clearInterval(moveLoop);
      clearInterval(moveToRight);
      isStoppedRight = true;
    }
    if (e.keyCode == 37 || e.keyCode == 65) {
      DomPlayer().src = "./sprites/walk-with-weapon-1.png";
      clearInterval(moveLoop);
      clearInterval(moveToLeft);
      isStoppedLeft = true;
    }
  });
  window.addEventListener("click", () => {
    Player().attack();
  });
  Enemy().draw();
  Enemy().drawMovement();
};
runGame();

const animate = () => {
  requestAnimationFrame(animate);

  // DomEnemies().forEach((enemy) => {
  //   if (
  //     enemy.offsetLeft - DomPlayer().offsetLeft + 31 < 1 &&
  //     isNotAttacking == false
  //   ) {
  //     enemy.style.backgroundColor = "blue";
  //     enemy.remove();
  //   }
  //   if (enemy.offsetLeft - DomPlayer().offsetLeft + 31 < 1 && isNotAttacking) {
  //     DomPlayer().style.backgroundColor = "red";
  //     return clearInterval(enemyWalk);
  //   }
  // });
};
animate();

AutoReload.Watch("localhost:60000");
// Main application
let scale = 0.8;
class App extends PIXI.Application {
  constructor(config) {
    super(config);
    document.getElementById(config.canvas_id).appendChild(this.view);
    window.addEventListener("resize", () => {
      if (window.innerWidth < window.innerHeight) {
        this.renderer.resize(
          window.innerWidth * scale,
          window.innerWidth * scale
        );
        this.stage.scale.set(
          (window.innerWidth * scale) / 500,
          (window.innerWidth * scale) / 500
        );
      } else if (window.innerWidth > window.innerHeight) {
        this.renderer.resize(
          window.innerHeight * scale,
          window.innerHeight * scale
        );
        this.stage.scale.set(
          (window.innerHeight * scale) / 500,
          (window.innerHeight * scale) / 500
        );
      }
    });
    this.stage.updateLayersOrder = function() {
      this.children.sort((a, b) => {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex;
      });
    };
  }
}

let config = {
  width: window.innerWidth * scale,
  height: window.innerWidth * scale,
  antialias: true,
  canvas_id: "game_area",
  transparent: true,
  game_loop
};

let app = new App(config);

PIXI.loader
  .add("background.jpg")
  .add("button.png")
  .load(onAssetsLoaded);

let background, login;

function onAssetsLoaded() {
  background = new PIXI.Sprite(PIXI.loader.resources["background.jpg"].texture);
  background.width = app.renderer.width;
  background.height = app.renderer.height;
  // background.interactive = true;
  // background.cursor = 'wait';

  login = new PIXI.Sprite(PIXI.loader.resources["button.png"].texture);
  login.scale.set(0.1, 0.1);
  login.interactive = true;
  login.buttonMode = true;
  login.position.set(400, 350);
  login.on("pointerdown", onButtonDown).on("pointerup", onButtonUp);
  //     .on('pointerupoutside', onDragEnd)
  //     .on('pointermove', onDragMove);
  // login.cursor = 'wait';

  app.stage.addChild(login);
  app.stage.addChild(background);
  app.stage.salam = 3;

  let kb = keyboard("a");
  kb.press = () => {};
  login.zIndex = 2;
  background.zIndex = 1;

  app.stage.updateLayersOrder();

  new Promise(resolve => {
    app.ticker.add(function(delta) {
      if (background.alpha > 0) {
        background.alpha -= delta * 0.05;
        return;
      }
      app.ticker.remove(this.fn);
      resolve();
    });
  }).then(() => {
    app.stage.removeChild(background);
  });
}

function game_loop(delta) {}

function onButtonDown(event) {
  console.log(this.parent.salam);
}

function onDragMove(event) {}

function onButtonUp(event) {
  console.log("up");
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode.toUpperCase().charCodeAt(0);
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}

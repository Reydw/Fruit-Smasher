class Animation {
    constructor(animation_speed) {
        let animation_running = false;

        this.animation_running = function () {
            return animation_running;
        };

        this.remove_fruits = function (fruits) {
            let promises = [];
            fruits.forEach(fruit => {
                promises.push(
                    new Promise(finish_animation => {
                        animation_running = true;

                        function animation() {
                            if (fruit.scale.x > 0) {
                                fruit.scale.x -= animation_speed / 800;
                                fruit.scale.y -= animation_speed / 800;
                                return;
                            }

                            fruit.scale.x = 0;
                            fruit.scale.y = 0;
                            App.ticker.remove(animation);
                            finish_animation();
                        }
                        App.ticker.add(animation);
                    })
                );
            });
            return Promise.all(promises).then(() => {
                animation_running = false;
            });
        };

        this.bring_down = function (fruits, positions) {
            let promises = [];
            fruits.forEach((fruit, i) => {
                promises.push(
                    new Promise(finish_animation => {
                        animation_running = true;

                        function animation() {
                            if (fruit.y < positions[i]) {
                                fruit.y += animation_speed;
                                return;
                            }

                            fruit.y = positions[i];
                            App.ticker.remove(animation);
                            finish_animation();
                        }
                        App.ticker.add(animation);
                    })
                );
            });
            return Promise.all(promises).then(() => {
                animation_running = false;
            });
        };

        this.interchangeX = function (fruit1, fruit2) {
            let fruits = [];

            if (fruit1.x > fruit2.x) {
                fruits = [fruit1, fruit2];
            } else {
                fruits = [fruit2, fruit1];
            }

            let x = [fruits[0].x, fruits[1].x];

            return new Promise(finish_animation => {
                animation_running = true;

                function animation() {
                    if (fruits[0].x > x[1]) {
                        fruits[0].x -= Math.sign(x[0] - x[1]) * animation_speed;
                        fruits[1].x += Math.sign(x[0] - x[1]) * animation_speed;
                        return;
                    }

                    fruits[0].x = x[1];
                    fruits[1].x = x[0];

                    App.ticker.remove(animation);
                    finish_animation();
                }
                App.ticker.add(animation);
            }).then(() => {
                animation_running = false;
            });
        };

        this.interchangeY = function (fruit1, fruit2) {
            let fruits = [];

            if (fruit1.y > fruit2.y) {
                fruits = [fruit1, fruit2];
            } else {
                fruits = [fruit2, fruit1];
            }

            let y = [fruits[0].y, fruits[1].y];

            return new Promise(finish_animation => {
                animation_running = true;

                function animation() {
                    if (fruits[0].y > y[1]) {
                        fruits[0].y -= Math.sign(y[0] - y[1]) * animation_speed;
                        fruits[1].y += Math.sign(y[0] - y[1]) * animation_speed;
                        return;
                    }

                    fruits[0].y = y[1];
                    fruits[1].y = y[0];

                    App.ticker.remove(animation);
                    finish_animation();
                }
                App.ticker.add(animation);
            }).then(() => {
                animation_running = false;
            });
        };
    }
}
class FruitArray extends Array {
    constructor(size) {
        super();

        for (let i = 0; i < size; i++) {
            this[i] = [];
        }

        function remove_all() {
            let fruits = [];
            for (let i = 0; i < nr_of_cells; i++) {
                for (let j = 0; j < nr_of_cells; j++) {
                    if (fruits_array[i][j] != null) {
                        // Found fruit at (i, j)
                        fruits = fruits.concat(check_fruit(i, j));
                    }
                }
            }

            return animation.remove_fruits(fruits).then(() => {
                fruits.forEach(fruit => {
                    fruit.remove();
                });
            });
        }

        this.check_for_matches = function () {
            for (let i = 0; i < nr_of_cells; i++) {
                for (let j = 0; j < nr_of_cells; j++) {
                    if (check_fruit(i, j).length > 0) {
                        return true;
                    }
                }
            }
            return false;
        };

        function check_fruit(i, j) {
            let fruits = [],
                temp = [],
                count = 0;
            for (let k = i + 1; k < nr_of_cells; k++) {
                if (
                    fruits_array[k][j] == null ||
                    !fruits_array[i][j].equals(fruits_array[k][j])
                ) {
                    break;
                }
                temp.push(fruits_array[k][j]);
                count++;
            }
            if (count > 1) {
                fruits = fruits.concat(temp);
            }
            temp = [];
            count = 0;
            for (let k = j + 1; k < nr_of_cells; k++) {
                if (
                    fruits_array[i][k] == null ||
                    !fruits_array[i][j].equals(fruits_array[i][k])
                ) {
                    break;
                }
                temp.push(fruits_array[i][k]);
                count++;
            }
            if (count > 1) {
                fruits = fruits.concat(temp);
            }
            if (fruits.length != 0) {
                fruits.push(fruits_array[i][j]);
            }
            return fruits;
        }

        function bring_down() {
            let fruits = [],
                positions = [],
                indexes = [];
            for (let j = 0; j < nr_of_cells; j++) {
                for (let i = nr_of_cells - 1; i > -1; i--) {
                    if (fruits_array[i][j] == null) {
                        // Found hole at (i, j)
                        let nr_of_fruits = 0;
                        for (let k = i - 1; k > -1; k--) {
                            if (fruits_array[k][j] != null) {
                                // Found fruit on k, j
                                fruits.push(fruits_array[k][j]);
                                positions.push(
                                    (i - nr_of_fruits) * (cell_size + line_width) + cell_size / 2
                                );
                                indexes.push(i - nr_of_fruits++);
                            }
                        }
                        break;
                    }
                }
            }
            return animation.bring_down(fruits, positions).then(() => {
                fruits.forEach((fruit, i) => {
                    fruits_array[fruit.i][fruit.j] = null;
                    fruit.i = indexes[i];
                    fruits_array[fruit.i][fruit.j] = fruit;
                });
            });
        }

        function refill() {
            let fruits = [],
                positions = [];
            for (let i = 0; i < nr_of_cells; i++) {
                for (let j = 0; j < nr_of_cells; j++) {
                    if (fruits_array[i][j] == null) {
                        fruits_array[i][j] = new Fruit(i, j);
                        fruits.push(fruits_array[i][j]);
                        positions.push(i * (cell_size + line_width) + cell_size / 2);
                    }
                }
            }
            return animation.bring_down(fruits, positions);
        }

        this.remove_all_and_refill = async function () {
            while (this.check_for_matches()) {
                await remove_all();
                await bring_down();
                await refill();
            }
        };
    }

    interchange(fruit1, fruit2) {
        let i1 = fruit1.i,
            i2 = fruit2.i,
            j1 = fruit1.j,
            j2 = fruit2.j;

        let temp = fruits_array[i1][j1];

        fruits_array[i1][j1] = fruits_array[i2][j2];
        fruits_array[i2][j2] = temp;

        fruits_array[i1][j1].i = i1;
        fruits_array[i1][j1].j = j1;
        fruits_array[i2][j2].i = i2;
        fruits_array[i2][j2].j = j2;
    }
}
class Fruit extends PIXI.Sprite {
    constructor(i, j) {
        // Create new PIXI.Sprite with a random texture(fruit)
        super(textures.random());

        // Add fruit to the stage
        App.stage.addChild(this);
        // Center anchor on fruit
        this.anchor.set(0.5);
        // Set starting position
        this.position.x = j * (cell_size + line_width) + cell_size / 2;
        this.position.y =
            (i - nr_of_cells + 1) * (cell_size - line_width) - cell_size / 2;
        // console.log(this.position.y);
        // Set fruti scale
        this.scale.set(0.4, 0.4);
        // Enable input on fruit
        this.interactive = true;

        // Custom properties
        this.i = i;
        this.j = j;
        this.on("pointerdown", onDragStart)
            .on("pointerup", onDragEnd)
            .on("pointerupoutside", onDragEnd)
            .on("pointermove", onDragMove);
    }

    equals(fruit) {
        if (this.texture.textureCacheIds[0] == fruit.texture.textureCacheIds[0]) {
            return true;
        } else {
            return false;
        }
    }

    remove() {
        App.stage.removeChild(this);
        fruits_array[this.i][this.j] = null;
        document.getElementById("score").innerHTML =
            parseInt(document.getElementById("score").innerHTML) + 10;
    }
}

function onDragStart(event) {
    if (animation.animation_running()) return;
    mouse_data = {
        start: {
            x: event.data.global.x,
            y: event.data.global.y
        },
        current: event.data.global
    };
    selected_fruit = this;
    status = "selected";
}

function onDragMove() {
    if (animation.animation_running()) return;
    if (status == "static") return;
    let deltaX = Math.abs(mouse_data.start.x - mouse_data.current.x);
    let deltaY = Math.abs(mouse_data.start.y - mouse_data.current.y);
    if (deltaX > cell_size / 2) {
        deltaX_function();
    } else if (deltaY > cell_size / 2) {
        deltaY_function();
    }
}

async function deltaX_function() {
    let next;
    status = "static";
    if (mouse_data.start.x > mouse_data.current.x) {
        next = fruits_array[selected_fruit.i][selected_fruit.j - 1];
    } else {
        next = fruits_array[selected_fruit.i][selected_fruit.j + 1];
    }

    await animation.interchangeX(selected_fruit, next);
    fruits_array.interchange(selected_fruit, next);

    if (fruits_array.check_for_matches()) {
        await fruits_array.remove_all_and_refill();
    } else {
        await animation.interchangeX(selected_fruit, next);
        fruits_array.interchange(selected_fruit, next);
    }
    status = "static";
    mouse_data = null;
    selected_fruit = null;
}

async function deltaY_function() {
    let next;
    status = "static";

    if (mouse_data.start.y > mouse_data.current.y) {
        next = fruits_array[selected_fruit.i - 1][selected_fruit.j];
    } else {
        next = fruits_array[selected_fruit.i + 1][selected_fruit.j];
    }

    await animation.interchangeY(selected_fruit, next);
    fruits_array.interchange(selected_fruit, next);

    if (fruits_array.check_for_matches()) {
        await fruits_array.remove_all_and_refill();
    } else {
        await animation.interchangeY(selected_fruit, next);
        fruits_array.interchange(selected_fruit, next);
    }

    status = "static";
    mouse_data = null;
    selected_fruit = null;
}

function onDragEnd() {
    if (animation.animation_running()) return;
    status = "static";
    mouse_data = null;
    selected_fruit = null;
}
// Configuration
let mouse_data,
    selected_fruit,
    status = "static",
    textures;
const nr_of_cells = 8,
    cell_size = 60,
    line_width = 0.06 * cell_size,
    width = cell_size * nr_of_cells + line_width * (nr_of_cells - 1),
    height = width;

// Main application
let App = new PIXI.Application({
    width: width,
    height: height,
    antialias: true
});
document.getElementById("game_area").appendChild(App.view);
let animation = new Animation(8);

// Load sprites
PIXI.loader.add("atlas.json").load(onAssetsLoaded);

// Main array
let fruits_array = new FruitArray(nr_of_cells);

// Draw grid lines
let line = new PIXI.Graphics();
App.stage.addChild(line);
for (let i = 1; i < nr_of_cells; i++) {
    line
        .lineStyle(line_width, 0xffffff)
        .moveTo(cell_size * i + line_width * (i - 1) + line_width / 2, 0)
        .lineTo(cell_size * i + line_width * (i - 1) + line_width / 2, height);
    line
        .lineStyle(line_width, 0xffffff)
        .moveTo(0, cell_size * i + line_width * (i - 1) + line_width / 2)
        .lineTo(width, cell_size * i + line_width * (i - 1) + line_width / 2);
}
line = null;

function onAssetsLoaded() {
    textures = ["apple", "avocado", "banana", "cocos", "grape"].map(file => {
        return PIXI.Texture.fromFrame(file);
    });
    textures.__proto__.random = function () {
        return this[Math.floor(Math.random() * this.length)];
    };
    let fruits = [],
        positions = [];
    // Fill grid with fruits
    for (let i = 0; i < nr_of_cells; i++) {
        for (let j = 0; j < nr_of_cells; j++) {
            fruits_array[i][j] = new Fruit(i, j);
            fruits.push(fruits_array[i][j]);
            positions.push(i * (cell_size + line_width) + cell_size / 2);
        }
    }
    // Animate fruits (bring down)
    animation.bring_down(fruits, positions).then(() => {
        fruits_array.remove_all_and_refill();
    });
}

function shuffle() {
    if (animation.animation_running()) return;
    let fruits = [],
        positions = [];
    // Fill grid with fruits
    for (let i = 0; i < nr_of_cells; i++) {
        for (let j = 0; j < nr_of_cells; j++) {
            fruits_array[i][j].remove();
            fruits_array[i][j] = new Fruit(i, j);
            fruits.push(fruits_array[i][j]);
            positions.push(i * (cell_size + line_width) + cell_size / 2);
        }
    }
    document.getElementById("score").innerHTML =
        parseInt(document.getElementById("score").innerHTML) - 400;
    // Animate fruits (bring down)
    animation.bring_down(fruits, positions).then(() => {
        fruits_array.remove_all_and_refill();
    });
}
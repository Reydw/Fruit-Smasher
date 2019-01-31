// Configuration
let
    mouse_data,
    selected_fruit,
    status = 'static',
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
document.getElementById('game_area').appendChild(App.view);
let animation = new Animation(8);

// Load sprites
PIXI.loader.add('../assets/atlas.json').load(onAssetsLoaded);

// Main array
let fruits_array = new FruitArray(nr_of_cells);

// Draw grid lines
let line = new PIXI.Graphics();
App.stage.addChild(line);
for (let i = 1; i < nr_of_cells; i++) {
    line.lineStyle(line_width, 0xffffff).moveTo(cell_size * i + line_width * (i - 1) + line_width / 2, 0).lineTo(cell_size * i + line_width * (i - 1) + line_width / 2, height);
    line.lineStyle(line_width, 0xffffff).moveTo(0, cell_size * i + line_width * (i - 1) + line_width / 2).lineTo(width, cell_size * i + line_width * (i - 1) + line_width / 2);
}
line = null;

function onAssetsLoaded() {
    textures = ['apple', 'avocado', 'banana', 'cocos', 'grape'].map(file => {
        return PIXI.Texture.fromFrame(file)
    });
    textures.__proto__.random = function () {
        return this[Math.floor(Math.random() * this.length)]
    }
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
    document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML) - 400;
    // Animate fruits (bring down)
    animation.bring_down(fruits, positions).then(() => {
        fruits_array.remove_all_and_refill();
    });
}
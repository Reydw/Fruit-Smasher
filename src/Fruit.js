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
        this.position.y = (i - nr_of_cells + 1) * (cell_size - line_width) - cell_size / 2;
        // console.log(this.position.y);
        // Set fruti scale
        this.scale.set(0.4, 0.4);
        // Enable input on fruit
        this.interactive = true;

        // Custom properties
        this.i = i;
        this.j = j;
        this.on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
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
        document.getElementById('score').innerHTML = parseInt(document.getElementById('score').innerHTML) + 10;
    }

}
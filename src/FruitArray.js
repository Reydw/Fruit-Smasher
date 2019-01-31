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
                    if (fruits_array[i][j] != null) { // Found fruit at (i, j)
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
        }

        function check_fruit(i, j) {
            let fruits = [],
                temp = [],
                count = 0;
            for (let k = i + 1; k < nr_of_cells; k++) {
                if (fruits_array[k][j] == null || !fruits_array[i][j].equals(fruits_array[k][j])) {
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
                if (fruits_array[i][k] == null || !fruits_array[i][j].equals(fruits_array[i][k])) {
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
                    if (fruits_array[i][j] == null) { // Found hole at (i, j)
                        let nr_of_fruits = 0;
                        for (let k = i - 1; k > -1; k--) {
                            if (fruits_array[k][j] != null) { // Found fruit on k, j
                                fruits.push(fruits_array[k][j]);
                                positions.push((i - nr_of_fruits) * (cell_size + line_width) + cell_size / 2);
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
        }

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
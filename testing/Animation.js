class Animation {

    constructor(animation_speed) {

        let animation_running = false;

        this.animation_running = function () {
            return animation_running;
        };

        this.remove_fruits = function (fruits) {
            let promises = [];
            fruits.forEach(fruit => {
                promises.push(new Promise(finish_animation => {
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
                }));
            });
            return Promise.all(promises).then(() => {
                animation_running = false;
            });
        };

        this.bring_down = function (fruits, positions) {
            let promises = [];
            fruits.forEach((fruit, i) => {
                promises.push(new Promise(finish_animation => {
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
                }));
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
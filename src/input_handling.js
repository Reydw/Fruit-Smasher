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
    status = 'selected';
}

function onDragMove() {
    if (animation.animation_running()) return;
    if (status == 'static') return;
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
    status = 'static';
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
    status = 'static';
    mouse_data = null;
    selected_fruit = null;
}

async function deltaY_function() {
    let next;
    status = 'static';

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

    status = 'static';
    mouse_data = null;
    selected_fruit = null;
}

function onDragEnd() {
    if (animation.animation_running()) return;
    status = 'static';
    mouse_data = null;
    selected_fruit = null;
}
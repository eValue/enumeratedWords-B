// shuffle array function
export function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// return random number
export function randomNumber(min, max) {
    return Math.floor(max - Math.random()*(max - min));
}

// select sound based on voice name from array of sound objects
export function select_sound(array, name) {
    let i = 0;

    while (array[i].name !== name) {
        i++;
    }

    return array[i];
}
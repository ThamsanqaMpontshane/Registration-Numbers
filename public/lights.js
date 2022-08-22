const theCircle = document.getElementsByClassName('circle');
const theCircle2 = document.getElementsByClassName('circle2');

// function to change randomly the color of the circle when btn is clicked
function changeColor() {
    const randomColor = `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
    theCircle[0].style.backgroundColor = randomColor;
    theCircle2[0].style.backgroundColor = randomColor;
}
// play sound everytime when btn is clicked
function playSound() {
    const audio = new Audio('./mixkit-car-horn-718.wav');
    return audio.play();
}








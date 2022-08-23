const theCircle = document.getElementsByClassName('circle');
const theCircle2 = document.getElementsByClassName('circle2');

function changeColor() {
    const randomColor = `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
    theCircle[0].style.backgroundColor = randomColor;
    theCircle2[0].style.backgroundColor = randomColor;
}












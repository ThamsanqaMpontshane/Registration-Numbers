const theCircle = document.getElementsByClassName('circle');
const btn = document.getElementsByClassName('btn');

btn.addEventListener('click', () => {
    theCircle.style.backgroundColor = `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
});
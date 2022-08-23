function errorSounds() {
    function resetErrorSounds() {
        // reset button cicked
        const errorSound = new Audio("./reset.mp3");
        return errorSound.play();
    };
    function error1() {
        // invalid registration
        const errorSound = new Audio("./error1.mp3");
        return errorSound.play();
    };
    function error2() {
        // reg number exist
        const errorSound = new Audio("./error2.mp3");
        return errorSound.play();
    }
    return {
        resetErrorSounds,
        error1,
        error2,
    }
};

export default errorSounds;

import {Howl, Howler} from 'howler';
const error1 = new Howl({
  src: ['./public/error1.mp3'],
});
const error2 = new Howl({
    src: ['./public/error2.mp3']
  });
  
const reset = new Howl({
    src: ['./public/reset.mp3']
  });
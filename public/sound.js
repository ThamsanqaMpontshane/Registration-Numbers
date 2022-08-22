import registration from "../registration";

const theReg = registration(db);
function errorSounds() {
    function resetErrorSounds() {
        const errorSound = new Audio("./reset.mp3");
        return errorSound.play();
    };
    function error1() {
        const errorSound = new Audio("./error1.mp3");
        return errorSound.play();
    };
    function error2() {
        const errorSound = new Audio("./error2.mp3");
        return errorSound.play();
    }
    function error3() {
        const errorSound = new Audio("./error3.mp3");
        return errorSound.play();
    }
    function soundDecision(regNumber) {
        const regex = /^[a-zA-Z]{2}\d{3}$/;
        if (regex.test(regNumber) === false && regNumber.length != 5) {
            // invalid reg number
            return error1();
        } 
        else if (theReg.getRegNumber().includes(regNumber)) {
            // reg number exists
            return error2();
        }
    }
    return {
        resetErrorSounds,
        error1,
        error2,
        error3,
        soundDecision
    }
};

export default errorSounds;
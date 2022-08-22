//  import errorSounds from "./sound.js"
//  const theSound = errorSounds();

function registration(db){
    // !F1
    async function setRegNumber(regNumber){
        const regNumberRegex = /^[a-zA-Z]{2}\d{3}$/;
        const selectReg = await db.manyOrNone('select * from reg_numbers where reg_number = $1',[regNumber]);
        const count = await db.manyOrNone('select count(*) from reg_numbers');
        if(selectReg.length == 0 && regNumberRegex.test(regNumber) && regNumber.length == 5 && count[0].count < 10){
        const theSlice = regNumber.slice(0, 2);
        const upperCased = theSlice.toUpperCase();
        const selectId = await db.one(`SELECT id FROM towns WHERE plate = $1`, [upperCased]);
        const theReg = await db.one(`INSERT INTO reg_numbers (reg_number, town_id) VALUES ($1, $2) RETURNING reg_number`, [regNumber, selectId.id]);
        return theReg.reg_number;
        }else if (selectReg.length > 0){
            return selectReg[0].reg_number;
        }
        theSound.soundDecision()
}
    // !F2
    async function getRegNumber(){
        const theregies = await db.manyOrNone(`SELECT reg_number FROM reg_numbers`);
        return theregies.map(reg => reg.reg_number); 
}
    // !F3
    async function getRegNumberByCity(town){
        const theregies = await db.manyOrNone(`SELECT reg_number FROM reg_numbers WHERE town_id = (SELECT id FROM towns WHERE plate = $1)`, [town]);
        return theregies.map(reg => reg.reg_number);
}
    // !F4
    async function reset(){
       return await db.manyOrNone(`delete from reg_numbers`);
}   
    return {
        setRegNumber,
        getRegNumber,
        getRegNumberByCity,
        reset,
    }
}
export default registration;
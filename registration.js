function registration(db){
    // !F1
    async function setRegNumber(regNumber){
        const regNumberRegex = /^((CA|CY|CL)\s([0-9]){3}(\-|\s)([0-9]){3})$/;
        const selectReg = await db.manyOrNone('select * from reg_numbers where reg_number = $1',[regNumber]);
        const count = await db.manyOrNone('select count(*) from reg_numbers');
        if(selectReg.length == 0 && regNumberRegex.test(regNumber) && regNumber.length < 12 && count[0].count < 6){
        const theSlice = regNumber.slice(0, 2);
        const upperCased = theSlice.toUpperCase();
        const selectId = await db.one(`SELECT id FROM towns WHERE plate = $1`, [upperCased]);
        const theReg = await db.one(`INSERT INTO reg_numbers (reg_number, town_id) VALUES ($1, $2) RETURNING reg_number`, [regNumber, selectId.id]);
        return theReg.reg_number;
        }else if (selectReg.length > 0){
            return selectReg[0].reg_number;
        }
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
       return await db.none(`delete from reg_numbers`);
}   
const getTownName =  async town => { 
    return await db.one(`SELECT name from towns where plate = $1`,[town]);}
    return {
        setRegNumber,
        getRegNumber,
        getRegNumberByCity,
        reset,
        getTownName
    } 
}
export default registration;
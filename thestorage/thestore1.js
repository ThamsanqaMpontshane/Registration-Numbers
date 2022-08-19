function registration(db){

    // !F1
    async function setRegNumber(regNumber,town){
        const selectId = await db.manyOrNone('Select id from towns where plate = $1', [town]);
        const selectReg = await db.manyOrNone('select * from reg_numbers where reg_number = $1',[regNumber])
        if(selectReg.length == 0){
            return await db.manyOrNone(` INSERT INTO reg_numbers (reg_number, town_id) VALUES ($1, $2`, [regNumber,selectId[0].id])
        }
    }
    // !F2
    async function getRegNumber(){
        const theregies = await db.manyOrNone(`SELECT reg_number FROM reg_numbers`);
        return theregies.map(reg => reg.reg_number); 
}
    // !F3
    async function getRegNumberByCity(city){
        const theregies = await db.manyOrNone(`SELECT reg_number FROM reg_numbers WHERE town_id = (SELECT id FROM towns WHERE name = $1)`, [city]);
        return theregies.map(reg => reg.reg_number);
}
    return {
        setRegNumber,
        getRegNumber,
        getRegNumberByCity
    }
}
export default registration;
const regies = (theRegies) => {
    let message = "";
    async function defaultRoute(req, res) {
        const regNumbers = await theRegies.getRegNumber();
        const theMessage = message;
        res.render("index", {
            regNumbers,
            message : theMessage
        });
    }
    async function addRegNumbers(req, res) {
        const regNumberRegex = /^((CA|CY|CL)\s([0-9]){3}(\-|\s)([0-9]){3})$/;
        const getTheReg = await theRegies.getRegNumber();
        const { myReg } = req.body;
        if(regNumberRegex.test(myReg) == false){
            message = 'Invalid Registration Number'
        }else if(getTheReg.includes(myReg)){
            message = 'Registration Number Exist'
        }
        else{
            message = '';
        }
        await theRegies.setRegNumber(myReg);
        res.redirect("/");
    }

    async function filterRegNumbers(req, res) {
        const { town } = req.body;
        if (town == "ALL") {
            const regNumbers = await theRegies.getRegNumber();
            res.render("index", {
                regNumbers
            });
            return;
        }
        const regNumbers = await theRegies.getRegNumberByCity(town);
        // const theTown = await db.manyOrNone(`SELECT name from towns where plate = $1`,[town]);
        if (regNumbers.length === 0 && town != "ALL")  {
            var message = `No Registration Numbers found for ${town}`;
        }
            res.render("index", {
                regNumbers,
                message
        })
    }
    async function resetRegNumbers(req, res) {
        await theRegies.reset();
        res.redirect('/');
    }
    return {
        defaultRoute,
        addRegNumbers,
        filterRegNumbers,
        resetRegNumbers
    }
}

export default regies;
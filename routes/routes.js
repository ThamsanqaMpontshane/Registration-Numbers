const regies = (theRegies) => {

    async function defaultRoute(req, res) {
        const regNumbers = await theRegies.getRegNumber();
        res.render("index", {
            regNumbers
        });
    }
    async function addRegNumbers(req, res) {
        const { myReg } = req.body;
        await theRegies.setRegNumber(myReg);
        res.redirect("/");
    }

    async function filterRegNumbers(req, res) {
        const regNumberRegex = /^[a-zA-Z]{2}\d{3}$/;
        const { town } = req.body;
        const { myReg } = req.body;
        if (town == "ALL") {
            const regNumbers = await theRegies.getRegNumber();
            res.render("index", {
                regNumbers
            });
            return;
        }
        const regNumbers = await theRegies.getRegNumberByCity(town);
        if (regNumbers.length === 0 && town != "ALL") {
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


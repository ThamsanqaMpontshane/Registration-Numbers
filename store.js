app.get("/", async (req, res) => {
    const regNumbers = await registration1.getRegNumber();
    res.render("index", {
        regNumbers
    });
    });
app.get("/reg_numbers", async (req, res) => {
    const regNumbers = await registration1.getRegNumber();
    res.render("reg_number", {
        theRegNumbersBox: regNumbers
    });
app.post("/reg_numbers", async (req, res) => {
    const { regNumber } = req.body;
    const town = reg.body.town;
    await registration1.setRegNumber(regNumber);
    res.redirect("/");
    });


app.listen(process.env.PORT || 3100, () => {
    console.log("Server is running on port 3000");
}
);
});


if(town === "CA"){
    const regNumbers = await registration1.getRegNumberByCity("Cape Town");
    res.render("index", {
        regNumbers,
    });
}
else if(town === "CL"){
    const regNumbers = await registration1.getRegNumberByCity("Paarl");
    res.render("index", {
        regNumbers,
    });
}
else if(town === "CY"){
    const regNumbers = await registration1.getRegNumberByCity("Bellville");
    res.render("index", {
        regNumbers,
    });


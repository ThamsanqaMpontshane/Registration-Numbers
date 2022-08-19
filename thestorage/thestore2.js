import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import pgPromise from 'pg-promise';
import registration from "./registration.js";


const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_registration';

const config = {
    connectionString    
}

if(process.env.NODE_ENV == "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
const registration1 = registration(db);

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.get("/", async (req, res) => {
    const regNumbers = await registration1.getRegNumber();
    res.render("index", {
        regNumbers,
    });

});
app.post("/reg_numbers", async (req, res) => {
    const { myReg } = req.body;
    const theSlice = myReg.slice(0, 2);
    await registration1.setRegNumber(myReg,theSlice);
    res.redirect("/");
});
// the route so that the user can select a town to see the reg numbers for that town
app.post("/filter", async (req, res) => {
    const town = req.body.town;
    await registration1.getRegNumberByCity(town);
    res.redirect("/");
});


//!PORT
app.listen(process.env.PORT || 3100, () => {
    console.log("Server is running on port 3100");
});


import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import pgPromise from 'pg-promise';
import registration from "./registration.js";
import routes from "./routes/routes.js";



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
const theRoutes = routes(registration1);

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));
app.get("/", theRoutes.defaultRoute);
app.post("/reg_numbers", theRoutes.addRegNumbers);
app.post("/filter", theRoutes.filterRegNumbers);
app.get("/reset", theRoutes.resetRegNumbers);


//!PORT
app.listen(process.env.PORT || 3100, () => {
    console.log("Server is running on port 3100");
});


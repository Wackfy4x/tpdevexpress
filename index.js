const express = require("express")
const app = express();
const cors = require('cors');
const path = require('path');

const port = 3000
const artisteRoute = require("./routes/artiste.route")
const utilisateurRoute = require("./routes/utilisateur.routes")
const noteRoute = require("./routes/note.route")


app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.get("/", (req, res) => {
    res.json({message: "ok"});
})
app.use("/artist", artisteRoute);
app.use("/user", utilisateurRoute);
app.use("/note", noteRoute);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({message: err.message});
    return;
    
})
app.listen(port, () => {
    console.log(`student app listening at http://localhost:${port}`);
})
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
    path: "./config.env"
});
const app = require("./app");
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then((result) => {
    console.log("DB connection successful!");
}).catch((err) => {
    console.log(err);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
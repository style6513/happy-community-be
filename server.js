require("./db/db.js");
const app = require("./app");
const { PORT } = require("./config");

const server = app.listen(PORT, () => {
    console.log(`project is running on port ${PORT}`)
});


process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION shutting down")
    server.close(() => {
        process.exit(1);
    })
});

process.on("uncaughtException", err => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT Exception shutting down")
    server.close(() => {
        process.exit(1);
    })
});

const app = require("./app");
const {PORT} = require("./config");

app.listen(PORT, () => {
    console.log(`project is running on port ${PORT}`)
})
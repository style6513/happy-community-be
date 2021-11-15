const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`project is running on port ${PORT}`)
})
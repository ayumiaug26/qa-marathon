const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('ワ ワァ！！！');
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
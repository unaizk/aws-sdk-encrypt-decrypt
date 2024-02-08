
const express = require('express');
const cors = require('cors')
const port =  5000;

const app = express();
app.use(cors());

app.post('/encrypt',(req,res) =>{
    res.send('hello');
})

app.get('/', (req, res) => res.send("Server is ready"));

app.listen(port, () => console.log(`Server started on port ${port}`));
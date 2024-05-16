const express = require('express');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // specify application is setup to work in JSON format

// origin route
app.get('/', (req, res) => {
    res.json('Hello World!')
});

// configure to use 'user' routes
app.use('/user', userRouter);
app.use('/task', taskRouter);

// start server @ port 9001
app.listen(9001, () => {
    console.log('Server is running on http://localhost:9001');
});
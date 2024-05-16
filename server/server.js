const express = require('express');
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');
const app = express();

app.use(express.json()); // specify application is setup to work in JSON format

// origin route
app.get('/', (req, res) => {
    res.json('Hello World!')
});

// configure to use 'user' routes
app.use('/user', userRouter);
app.use('/task', taskRouter);

// start server @ port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
const DatabaseService = require('../services/databaseService');
const dbService = new DatabaseService();

const taskController = {
  createTask: (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send('Task is required');
    }

    dbService.createTask(task, (err, id) => {
        if (err) {
            return res.status(500).send('Error adding task');
        }

        res.status(200).send({ id: id });
    });
  },
  getAllTasks: (req, res) => {
    dbService.getTasks((err, tasks) => {
        if (err) {
            return res.status(500).send('Error getting tasks');
        }

        res.status(200).send(tasks);
    });
  }
};

module.exports = taskController;
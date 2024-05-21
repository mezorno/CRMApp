const DatabaseService = require('../services/databaseService');
const dbService = new DatabaseService();

const itemController = {
  createItem: (req, res) => {
    const { item } = req.body;

    if (!item) {
        return res.status(400).send('Item is required');
    }

    dbService.createItem(item, (err, id) => {
        if (err) {
            return res.status(500).send('Error adding item');
        }

        res.status(200).send({ id: id });
    });
  },
  updateItem: (req, res) => {
    const { item } = req.body;

    if (!item) {
        return res.status(400).send('Item is required');
    }

    dbService.updateItem(item, (err, id) => {
        if (err) {
            return res.status(500).send('Error updating item');
        }

        res.status(200).send({ id: id });
    });
  },
  updateItemQuantity: (req, res) => {
    const { transaction } = req.body;

    if (!transaction) {
        return res.status(400).send('Transaction is required');
    }

    dbService.updateItemQuantity(transaction, (err, id) => {
        if (err) {
            return res.status(500).send('Error creating transaction for item');
        }

        res.status(200).send({ id: id });
    });
  },
  getItem(req, res) {
    const { item } = req.body;

    if (!item) {
        return res.status(400).send('Item is required');
    }

    dbService.getItem(item, (err, item) => {
        if (err) {
            return res.status(500).send('Error getting item');
        }

        res.status(200).send(item);
    });
  },
  getAllItems: (req, res) => {
    dbService.getItems((err, tasks) => {
        if (err) {
            return res.status(500).send('Error getting tasks');
        }

        res.status(200).send(tasks);
    });
  },
  test (req, res) {
    dbService.seedData();
    res.status(200).send('data seeded');
  }
};

module.exports = itemController;
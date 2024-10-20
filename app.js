const express = require('express')

const database = require('./database')

const app = express()
const port = 8000

app.use(express.json())

/** 
 * Retrieves an item by name
 * 
 * @param {String} req.params.name - The name of the item
 * 
 * @returns 
 * - 200 if the item is found
 * - 404 if the item is not found
 * - 500 if there is an error
 */
app.get('/items/:name', async (req, res) => {
    const name = req.params.name

    try {
        const item = await database.oneOrNone('SELECT * FROM item WHERE name = $1', name)

        if (item === null) {
            return res.status(404).json({ message: `Item not found` })
        }

        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.get('/items', async (req, res) => {
    const order = req.query.order;

    if (order == undefined) {
        return res.status(400).json({ message: "Order of results not specified" });
    } else if (order !== 'name' && order !== '-name') {
        return res.status(400).json({ message: "Invalid option for result order, should be one of 'name' or '-name'" });
    }

    try {
        const items = await database.manyOrNone('SELECT * FROM item')

        if (order === 'name') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (order === '-name') {
            items.sort((a, b) => b.name.localeCompare(a.name))
        };

        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app

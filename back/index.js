const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { TodoItemModel } = require('./models/TodoItem')

const port = 3000;

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))

app.get('/api/getTodoItems', async (req, res) => {
    try {
        const todoItems = await TodoItemModel.find({})
        const mappedTodoItems = todoItems.map((todoItem) => todoItem.toJSON())
        res.send({ isSuccess: true, todoItems: mappedTodoItems })
    } catch (e) {
        res.send({ isSuccess: false, error: e?.message })
    }
})

app.get('/api/getTodoItem/:todoItemId', async (req, res) => {
    try {
        const todoItem = await TodoItemModel.findById(req.params.todoItemId)
        const preparedTodoItem = todoItem ? todoItem.toJSON() : null
        res.send({ isSuccess: true, todoItem: preparedTodoItem })
    } catch (e) {
        res.send({ isSuccess: false, error: e?.message })
    }
})

app.post('/api/addTodoItem', async (req, res) => {
    try {
        const { isChecked, label } = req.body

        const todoItemModel = new TodoItemModel({ isChecked, label })
        await todoItemModel.save()
        res.send({ isSuccess: true, todoItem: todoItemModel.toJSON() })
    } catch (e) {
        res.send({ isSuccess: false, error: e?.message })
    }
})

app.delete('/api/removeTodoItem/:todoItemId', async (req, res) => {
    try {
        await TodoItemModel.deleteOne({ _id: req.params.todoItemId})

        res.send({ isSuccess: true })
    } catch (e) {
        res.send({ isSuccess: false, error: e?.message })
    }
})

app.patch('/api/updateTodoItem/:todoItemId', async (req, res) => {
    try {
        console.log('JSON', JSON.stringify(req.body), req.params.todoItemId)
        const { isChecked, label } = req.body

        await TodoItemModel.findOneAndUpdate({ _id: req.params.todoItemId }, { isChecked, label })

        res.send({ isSuccess: true })
    } catch (e) {
        res.send({ isSuccess: false, error: e?.message })
    }
})

const DB_URL = 'mongodb://localhost:27017'
mongoose.connect(DB_URL, {
    auth: {
        password: 'root',
        username: 'root'
    }
}).then(() => {
    app.listen(port, () => {
        console.log(`app started on ${3000}`);
    })
}).catch((e) => {
    console.error('error', e.message);
})
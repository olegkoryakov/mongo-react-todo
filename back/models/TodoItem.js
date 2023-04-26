const { Schema, model } = require('mongoose');

const TodoItem = new Schema({
    isChecked: { type: Boolean, require: true },
    label: { type: String, require: true },
})

const TodoItemModel = model('TodoItem', TodoItem);

module.exports = {
    TodoItemModel
}

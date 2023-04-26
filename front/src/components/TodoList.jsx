import { useCallback, useEffect, useState } from 'react';
import { TodoItem } from './TodoItem';
import { Input } from './Input';


export const TodoList = () => {
  const API_LINK = 'http://localhost:3000/api'
  const [todoItems, setTodoItems] = useState([]);
  const [nextTodoLabel, setNextTodoLabel] = useState('')


  const fetchTodoItems = useCallback(async () => {
    const response = await fetch(`${API_LINK}/getTodoItems`, { method: 'get' })
    const json = await response.json()
    console.log('json', json)
    setTodoItems(json.todoItems)
  }, [])

  useEffect(() => {
    console.log('adasdsda')
    fetchTodoItems()
  }, [])

  const createOnChangeCallback = useCallback((index) => async () => {
    const todoItemsCopy = JSON.parse(JSON.stringify(todoItems))
    const nextIsChecked = !todoItemsCopy[index].isChecked

    const response = await fetch(`${API_LINK}/updateTodoItem/${todoItemsCopy[index]._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          label: todoItemsCopy[index].label,
          isChecked: nextIsChecked
        })
      })
    
    const json = await response.json()

    if (json.isSuccess) {
      todoItemsCopy[index].isChecked = nextIsChecked
      setTodoItems(todoItemsCopy)
    }

  }, [todoItems])

  const onAddTodoClick = useCallback(async (evt) => {
    evt.preventDefault()
    const nextTodo = { isChecked: false, label: nextTodoLabel }
    const response = await fetch(`${API_LINK}/addTodoItem`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nextTodo)
      })
    
    const json = await response.json()

    if (json.isSuccess) {
      setNextTodoLabel('')
      setTodoItems((prevTodoItems) => [...prevTodoItems, json.todoItem])
    }
  }, [nextTodoLabel])

  const createOnDeleteCallback = useCallback((index) => async () => {
    const todoItemsCopy = JSON.parse(JSON.stringify(todoItems))
    const todoItemIdToDelete = todoItemsCopy[index]._id

    const response = await fetch(`${API_LINK}/removeTodoItem/${todoItemIdToDelete}`,
    {
      method: 'DELETE',
    })
  
    const json = await response.json()
    if (json.isSuccess) {
      todoItemsCopy.splice(index, 1)
      setTodoItems(todoItemsCopy)
    }
  }, [todoItems])

  return (
    <div className="App">
      {JSON.stringify(todoItems)}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Input
          value={nextTodoLabel}
          onChange={setNextTodoLabel}
          label="Введите название нового туду"
        />
        <button type="submit" onClick={onAddTodoClick}>SUBMIT</button>
      </div>
      {todoItems.map(({ isChecked, label, _id }, index) => (
        <div
          key={index}
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <TodoItem
            isChecked={isChecked}
            label={label}
            onChange={createOnChangeCallback(index)}
          />
          <button type="button" onClick={createOnDeleteCallback(index)} disabled={!_id}>DELETE</button>
        </div>
      ))}
    </div>
  );
}


import React from 'react'

export const TodoItem = ({
    isChecked,
    label,
    onChange
}) => {
    return (
        <div className="todo-item">
            <label>
                <input type="checkbox" onChange={onChange} checked={isChecked}/>
                {label}
            </label>
        </div>
    )
}
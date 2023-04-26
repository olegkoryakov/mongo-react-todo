import React, { useCallback } from 'react'

export const Input = ({
    label,
    value,
    onChange
}) => {
    const onInputChange = useCallback((event) => {
        const { value } = event.target
        console.log('check input value', value)
        onChange(value)
    }, [onChange])

    return (
        <div className="todo-item">
            <label>
                <span style={{ paddingRight: 20 }}>{label}</span>
                <input type="text" onChange={onInputChange} value={value}/>
            </label>
        </div>
    )
}
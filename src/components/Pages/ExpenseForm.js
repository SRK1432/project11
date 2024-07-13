import React, { useState } from "react";
import './ExpenseForm.css';

const ExpenseForm = () =>{
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [expenses, setExpenses] = useState([]);

    const submitHandler=event=>{
        event.preventDefault();
        const newExpense = {amount,description,category};
        setExpenses((prevExpenses)=>[...prevExpenses,newExpense])
    }
    return(
        <>
        <form className="expense-form" onSubmit={submitHandler}>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" onChange={((e)=>setAmount(e.target.value))}/>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" onChange={((e)=>setDescription(e.target.value))}/>
            <label htmlFor="category">Category</label>
            <select onChange={((e)=>setCategory(e.target.value))}>
            <option value=''>Select category</option>
            <option value='food'>Food</option>
            <option value='petrol'>Petrol</option>
            <option value='salary'>Salary</option>
            <option value='other'>Other</option>
            </select>
            <button type="submit">Add Expense</button>
        </form>

        <h1>Expenses</h1>
        <ul>
            {expenses.map((expense,index)=>(
                <li key={index}>{expense.amount}-{expense.description} ({expense.category})</li>
            ))}
        </ul>
        </>
    )
}
export default ExpenseForm;
import React, { useEffect, useState } from "react";
import './ExpenseForm.css';

const ExpenseForm = () =>{
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [expenses, setExpenses] = useState([]);

    const idToken = localStorage.getItem('idToken');
    useEffect(() => {
        const fetchExpenses = async () => {
          try {
            const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses.json?auth=${idToken}`);
            if (!response.ok) {
              throw new Error('Failed to fetch expenses');
            }
        }
        catch(error){
            console.error(error);
            }
        };
            fetchExpenses();
          }, [idToken]);
    const submitHandler= async(event)=>{
        event.preventDefault();
        const newExpense = { amount,description,category};
        try {
            const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses.json?auth=${idToken}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newExpense),
            });
      
            if (!response.ok) {
              throw new Error('Failed to add expense');
            }
      
            const data = await response.json();
            setExpenses(prevExpenses => [...prevExpenses,{ id: data.name, ...newExpense } ]);
            setAmount('');
            setDescription('');
            setCategory('');
          } catch (error) {
            console.error(error);
          }
        };
        

    return(
        <>
        <form className="expense-form" onSubmit={submitHandler}>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amount} onChange={((e)=>setAmount(e.target.value))}/>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" value={description} onChange={((e)=>setDescription(e.target.value))}/>
            <label htmlFor="category">Category</label>
            <select onChange={((e)=>setCategory(e.target.value))} value={category}>
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
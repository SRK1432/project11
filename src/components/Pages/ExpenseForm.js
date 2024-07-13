import React, { useEffect, useState } from "react";
import './ExpenseForm.css';

const ExpenseForm = () =>{
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);

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
        const newExpense = {amount,description,category};
        if (editingExpense) {
            // Editing existing expense
            try {
              const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json?auth=${idToken}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
              });
      
              if (!response.ok) {
                throw new Error('Failed to edit expense');
              }
      
              setExpenses(prevExpenses => prevExpenses.map(exp => exp.id === editingExpense.id ? { id: editingExpense.id, ...newExpense } : exp));
              setEditingExpense(null);
            } catch (error) {
              console.error(error);
            }
          } else {
            // Adding new expense
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
              setExpenses(prevExpenses => [...prevExpenses, { id: data.name, ...newExpense }]);
            } catch (error) {
              console.error(error);
            }
          }
      
          setAmount('');
          setDescription('');
          setCategory('');
        };
        const deleteHandler= async(id)=>{
            try{
                const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses/${id}.json?auth=${idToken}`,{
                method : 'DELETE',   
            })
            if(!response.ok){
                throw new Error('Failed to delete expense')
            }
            setExpenses((prevExpenses)=>prevExpenses.filter(exp=>exp.id !== id));
        }
        catch(error){
            console.log(error);
        }
      }
        const editHandler=(expense)=>{
            setAmount(expense.amount);
            setDescription(expense.description);
            setCategory(expense.category);
            setEditingExpense(expense)
        }
        

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
            <button type="submit">{editingExpense ? 'Update' : 'Add Expense'}</button>
        </form>

        <h1>Expenses</h1>
        <ul>
            {expenses.map((expense,index)=>(
                <li key={index}>{expense.amount}-{expense.description} ({expense.category})
                <button onClick={()=>editHandler(expense)}>Edit</button>
                <button onClick={()=>deleteHandler(expense.id)}>Delete</button>
                </li>
            ))}
        </ul>
        </>
    )
}

export default ExpenseForm;
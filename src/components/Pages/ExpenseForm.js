

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { expenseActions } from '../../store/expensesSlice';
import { themeActions } from '../../store/themeSlice'; // Import theme actions
import './ExpenseForm.css';

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses);
  const token = useSelector((state) => state.auth.token);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses.json?auth=${token}`);
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        const loadedExpenses = [];
        for (const key in data) {
          loadedExpenses.push({
            id: key,
            amount: data[key].amount,
            description: data[key].description,
            category: data[key].category,
          });
        }
        dispatch(expenseActions.setExpenses(loadedExpenses));
      } catch (error) {
        console.error(error);
      }
    };
    fetchExpenses();
  }, [dispatch, token]);

  useEffect(() => {
    if (totalExpenses > 10000) {
      dispatch(themeActions.toggleTheme());
    }
  }, [totalExpenses, dispatch]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const newExpense = { amount, description, category };

    if (editingExpense) {
      try {
        const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses/${editingExpense.id}.json?auth=${token}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });

        if (!response.ok) {
          throw new Error('Failed to edit expense');
        }

        dispatch(expenseActions.updateExpense({ id: editingExpense.id, ...newExpense }));
        setEditingExpense(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses.json?auth=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });

        if (!response.ok) {
          throw new Error('Failed to add expense');
        }

        const data = await response.json();
        dispatch(expenseActions.addExpense({ id: data.name, ...newExpense }));
      } catch (error) {
        console.error(error);
      }
    }

    setAmount('');
    setDescription('');
    setCategory('');
  };

  const deleteHandler = async (id) => {
    try {
      const response = await fetch(`https://expense-tracker-1c231-default-rtdb.firebaseio.com/expenses/${id}.json?auth=${token}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      dispatch(expenseActions.deleteExpense({ id }));
    } catch (error) {
      console.error(error);
    }
  };

  const editHandler = (expense) => {
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditingExpense(expense);
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Amount,Description,Category\n" +
      expenses.map(expense => `${expense.amount},${expense.description},${expense.category}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  return (
    <>
      <form className="expense-form" onSubmit={submitHandler}>
        <label htmlFor="amount">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label htmlFor="description">Description</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label htmlFor="category">Category</label>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
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
        {expenses.map((expense, index) => (
          <li key={index}>{expense.amount} - {expense.description} ({expense.category})
            <button onClick={() => editHandler(expense)}>Edit</button>
            <button onClick={() => deleteHandler(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button onClick={downloadCSV}>Download File</button>
    </>
  );
};

export default ExpenseForm;

import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AddInvoice from "./components/AddInvoice"
import Invoices from "./components/Invoices"

function App() {
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [invoices, setInvoices] = useState([])
  const URL = 'http://localhost:9090/api'

useEffect(() => {
    const getInvoices = async () => {
      const invoicesFromServer = await fetchInvoices()
      setInvoices(invoicesFromServer)
    }

    getInvoices()
  }, [])

  const fetchInvoices = async () => {
    const res = await fetch(URL + '/invoices')
    const data = await res.json()

    return data
  }

  const fetchInvoice = async (id) => {
    const res = await fetch(URL + `/invoices/${id}`)
    const data = await res.json()

    return data
  }

  const addInvoice = async (task) => {
    const res = await fetch(URL + '/invoices', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setInvoices([...invoices, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteInvoice = async (id) => {
    const res = await fetch(URL + `/invoices/${id}`, {
      method: 'DELETE',
    })
    //We should control the response status to decide if we will change the state or not.
    res.status === 200
      ? setInvoices(invoices.filter((invoice) => invoice.id !== id))
      : alert('Error Deleting This Invoice')
  }

  // Toggle Reminder
  const updateInvoice = async (id) => {
    const invoiceToToggle = await fetchInvoice(id)
    const updTask = { ...invoiceToToggle, nip: 'PL' + invoiceToToggle.reminder }

    const res = await fetch(URL + `/invoices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updTask),
    })

    const data = await res.json()

//     setInvoices(
//       invoices.map((invoice) =>
//         invoice.id === id ? { ...invoice, reminder: data.reminder } : task
//       )
//     )
  }

  return (
<Router>
      <div className='container'>
        <Route
          path='/'
          exact
          render={(props) => (
            <>
              {showAddInvoice && <AddInvoice onAdd={addInvoice} />}
              {invoices.length > 0 ? (
                <Invoices
                  invoices={invoices}
                  onDelete={deleteInvoice}
                />
              ) : (
                'No Invoices to show'
              )}
            </>
          )}
        />
      </div>
    </Router>

  );

}

export default App;

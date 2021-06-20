import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import AddInvoice from "./components/AddInvoice"
import Invoices from "./components/Invoices"
import Header from './components/Header'

function App() {
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [invoices, setInvoices] = useState([])
  const URL = 'http://localhost:9090/api'

  useEffect(() => {
    refreshList()
  }, [])

  const fetchInvoices = async () => {
    const res = await fetch(URL + '/invoice')
    const data = await res.json()
    return data
  }

  const fetchInvoice = async (id) => {
    const res = await fetch(URL + `/invoice/${id}`)
    const data = await res.json()
    return data
  }

  const refreshList = async () => {
    const getInvoices = async () => {
      const invoicesFromServer = await fetchInvoices()
      setInvoices(invoicesFromServer)
    }

    getInvoices()
  }

  const addInvoice = async (invoice) => {
    const res = await fetch(URL + '/invoice', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(invoice),
    })

    const data = await res.json()

    console.log(data)
    setInvoices([...invoices, data])
    refreshList()
  }

  const updateInvoice = async (id) => {
    const invoiceToToggle = await fetchInvoice(id)
    const res = await fetch(URL + `/invoice/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({number : "updated " + invoiceToToggle.invoice_number}),
    })

    const data = await res.json()

    refreshList()
  }

  const deleteInvoice = async (id) => {
    const res = await fetch(URL + `/invoice/${id}`, {
      method: 'DELETE',
    })
    res.status === 200
      ? setInvoices(invoices.filter((invoice) => invoice.id !== id))
      : alert('Error Deleting This Invoice')
  }

  return (
    <Router>
      <div className='container'>
        <Header
          onAdd={() => setShowAddInvoice(!showAddInvoice)}
          showAdd={showAddInvoice}
        />
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
                  onToggle={updateInvoice}
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

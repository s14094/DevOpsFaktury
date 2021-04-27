import { useState } from 'react'

const AddInvoice = ({ onAdd }) => {
  const [number, setNumber] = useState('')
  const [nip, setNip] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    if (!number) {
      alert('Please add a number')
      return
    }

    onAdd({ number, nip })

    setNumber('')
    setNip('')
  }

  return (
    <form className='add-form' onSubmit={onSubmit}>
      <div className='form-control'>
        <label>Number</label>
        <input
          type='text'
          placeholder='Add Number'
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>
      <div className='form-control'>
        <label>Nip</label>
        <input
          type='text'
          placeholder='Nip'
          value={nip}
          onChange={(e) => setNip(e.target.value)}
        />
      </div>

      <input type='submit' value='Save Invoice' className='btn btn-block' />
    </form>
  )
}

export default AddInvoice

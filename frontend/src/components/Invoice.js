import { FaTimes } from 'react-icons/fa'

const Invoice = ({ invoice, onDelete, onToggle }) => {
  return (
    <div
      className={`invoice`}
      onDoubleClick={() => onToggle(invoice.id)}
    >
      <h3>
        {invoice.number}{' '}
        <FaTimes
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => onDelete(invoice.id)}
        />
      </h3>
      <p>{invoice.nip}</p>
    </div>
  )
}

export default Invoice

import Invoice from './Invoice'

const Invoices = ({ invoices, onDelete, onToggle }) => {
  return (
    <>
      {invoices.map((invoice, index) => (
        <Invoice key={index} invoice={invoice} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </>
  )
}

export default Invoices

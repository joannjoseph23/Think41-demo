import axios from 'axios';
import { useEffect, useState } from 'react';
import CustomerModal from './CustomerModal'; // Import the modal component

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/customers')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setError('Failed to load customer data');
        setLoading(false);
      });
  }, []);

  // Filter customers based on search input
  const filtered = customers.filter(c =>
    c.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (id) => {
    setSelectedCustomerId(id);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  if (loading) return <div className="container mt-5"><h4>Loading customers...</h4></div>;
  if (error) return <div className="container mt-5"><h4 className="text-danger">{error}</h4></div>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Customer List</h1>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search by name or email"
        onChange={e => setSearch(e.target.value)}
      />

      {/* Customer Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Order Count</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(customer => (
              <tr
                key={customer.id}
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(customer.id)}
              >
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.email}</td>
                <td>{customer.order_count || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Component */}
      <CustomerModal
        customerId={selectedCustomerId}
        show={showModal}
        onClose={closeModal}
      />
    </div>
  );
}

export default CustomerList;

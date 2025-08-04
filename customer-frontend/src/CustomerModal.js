import axios from 'axios';
import { useEffect, useState } from 'react';

function CustomerModal({ customerId, show, onClose }) {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show && customerId) {
      setLoading(true);
      // Fetch customer details
      axios.get(`http://localhost:3000/customers/${customerId}`)
        .then(res => setCustomer(res.data))
        .catch(() => setCustomer(null));

      // Fetch orders
      axios.get(`http://localhost:3000/customers/${customerId}/orders`)
        .then(res => setOrders(res.data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [show, customerId]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Customer Details</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {customer ? (
                  <>
                    <h5>{customer.first_name} {customer.last_name}</h5>
                    <p>Email: {customer.email}</p>
                    <p>Total Orders: {customer.order_count}</p>
                  </>
                ) : (
                  <p className="text-danger">Customer details not found.</p>
                )}

                <hr />
                <h6>Orders</h6>
                {orders.length > 0 ? (
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.order_id}>
                          <td>{o.order_id}</td>
                          <td>{o.status}</td>
                          <td>{o.num_of_item}</td>
                          <td>{o.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No orders found for this customer.</p>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerModal;

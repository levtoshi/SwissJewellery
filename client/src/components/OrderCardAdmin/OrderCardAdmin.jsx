import { useState } from "react";
import "./OrderCardAdmin.scss";

const OrderCardAdmin = ({ order, onStatusChange, onDelete }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'assembled', label: 'Assembled' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    onStatusChange(order._id, newStatus);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const clientInfo = order.user ? `${order.user.fullName} (${order.user.email})` : 
    order.guestInfo ? `${order.guestInfo.fullName} (${order.guestInfo.email})` : 'Guest';

  return (
    <div className="order-admin-card">
      <div className="card-header">
        <div className="order-info">
          <h3 className="order-number">Order #{order._id.slice(-8)}</h3>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="settings-container">
          <select 
            className="status-select" 
            value={selectedStatus} 
            onChange={handleStatusChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="btn-delete" onClick={() => onDelete(order)}>Delete</button>
        </div>
      </div>

      <div className="card-content">
        <div className="client-info">
          <p><strong>Client:</strong> {clientInfo}</p>
          <p><strong>Address:</strong> {order.address || "none"}</p>
        </div>
        
        <div className="order-total">
          <p><strong>Sum:</strong> ${order.totalAmount}</p>
        </div>

        <div className="order-items">
          <p><strong>Products:</strong></p>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.name} (x{item.quantity}) - ${item.product.finalPrice * item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {order.comment && (
          <div className="order-comment">
            <p><strong>Comment:</strong> {order.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCardAdmin;
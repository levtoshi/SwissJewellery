import "./OrderCard.scss"

const OrderCard = ({order, onCancel}) => {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  return (
    <div className="order-card">
      <div className="card-header">
        <div className="order-info">
          <h3 className="order-number">Order #{order._id.slice(-8)}</h3>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>
        <div className="settings-container">
          <h2 className='status'>{order.status}</h2>
          {order.status !== "cancelled" && <button className="btn-cancel" onClick={() => onCancel(order)}>Cancel</button>}
        </div>
      </div>

      <div className="card-content">
        <div className="client-info">
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
  )
}

export default OrderCard;
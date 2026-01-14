import "./OrdersStatisticPanel.scss"

const OrdersStatisticPanel = ({orders, selectedStatus, selectedFilter, setSelectedStatus, setSelectedFilter}) => {
  const amountOfOrders = orders?.length || 0;
  const amountOfActiveOrders = orders?.filter(order => 
    ['new', 'confirmed', 'assembled', 'shipped'].includes(order.status)
  ).length || 0;
  const amountOfCompletedOrders = orders?.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  ).length || 0;

  return (
    <div>
      <div className="statistics-container">
        <div className="statistic-item">
          <p className="statistic-title">Total orders</p>
          <h4 className="statistic-data">{amountOfOrders}</h4>
        </div>
        <div className="statistic-item">
          <p className="statistic-title">Active orders</p>
          <h4 className="statistic-data">{amountOfActiveOrders}</h4>
        </div>
        <div className="statistic-item">
          <p className="statistic-title">Completed orders</p>
          <h4 className="statistic-data">{amountOfCompletedOrders}</h4>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Filter by status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="assembled">Assembled</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Quick filter:</label>
          <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All orders</option>
            <option value="active">Only active</option>
            <option value="completed">Only completed</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default OrdersStatisticPanel
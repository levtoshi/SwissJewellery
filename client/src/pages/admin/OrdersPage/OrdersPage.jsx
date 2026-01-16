import { useState } from 'react';
import Loader from "../../../components/Loader/Loader.jsx";
import OrderCardAdmin from "../../../components/OrderCardAdmin/OrderCardAdmin.jsx";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import OrdersStatisticPanel from "../../../components/OrdersStatisticPanel/OrdersStatisticPanel.jsx"
import useUpdateOrderStatus from '../../../hooks/orders/useUpdateOrderStatus.js';
import useDeleteOrder from '../../../hooks/orders/useDeleteOrder.js';
import useOrders from '../../../hooks/orders/useOrders.js';
import "./OrdersPage.scss";

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orders, isLoading, error } = useOrders(selectedStatus, true);
  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();

  const filteredOrders = orders?.filter(order => {
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }
    
    if (selectedFilter === "active") {
      return ['new', 'confirmed', 'assembled', 'shipped'].includes(order.status);
    } else if (selectedFilter === "completed") {
      return ['delivered', 'cancelled'].includes(order.status);
    }
    
    return true;
  }) || [];

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedOrder._id);
    closeModal();
  };

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="orders-page">
      <div className="flex-container">
        <h5 className="manage-title">Manage shop orders</h5>
      </div>

      <OrdersStatisticPanel
        orders={filteredOrders}
        selectedStatus={selectedStatus}
        selectedFilter={selectedFilter}
        setSelectedStatus={setSelectedStatus}
        setSelectedFilter={setSelectedFilter}/>

      {isLoading && <Loader />}

      {error && (
        <p className="error">
          Error loading orders: {error.response?.data?.message || error.response?.data?.error || error.message}
        </p>
      )}

      {!isLoading && !error && filteredOrders.length === 0 && (
        <p className="error">No orders found</p>
      )}

      {!isLoading && !error && filteredOrders.length > 0 && (
        <div className="orders-manage-container">
          {filteredOrders.map(order => (
            <OrderCardAdmin
              key={order._id}
              order={order}
              onStatusChange={handleStatusChange}
              onDelete={openModal}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleDelete}
        onCancel={closeModal}
        message={`Are you sure you want to delete order #${selectedOrder?._id.slice(-8)}?`}
        confirmMessage="Yes, Delete"
      />

      {(updateStatusMutation.isError || deleteMutation.isError) && (
        <div className="error-message">
          Error: {updateStatusMutation.error?.response?.data?.message || 
                  deleteMutation.error?.response?.data?.message || 
                  updateStatusMutation.error?.response?.data?.error || 
                  deleteMutation.error?.response?.data?.error || 
                  updateStatusMutation.error?.message || 
                  deleteMutation.error?.message}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
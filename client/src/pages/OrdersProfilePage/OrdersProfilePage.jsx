import { useState } from 'react'
import useOrders from '../../hooks/orders/useOrders'
import useCancelOrder from '../../hooks/orders/useCancelOrder';
import OrderCard from "../../components/OrderCard/OrderCard";
import OrdersStatisticPanel from "../../components/OrdersStatisticPanel/OrdersStatisticPanel";
import Loader from '../../components/Loader/Loader';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 
import "./OrdersProfilePage.scss";

const OrdersProfilePage = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orders, isLoading, error } = useOrders();
  const cancelMutation = useCancelOrder();

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

  const handleCancel = () => {
    cancelMutation.mutate(selectedOrder._id);
    closeModal();
  };

  return (
    <div className="orders-profile-page">
      <Link to="/profile" className="back-link">
        <ArrowLeft size={16}/>
        <p className="back-title">Back to profile</p>
      </Link>

      <div className="flex-container">
        <h5 className="manage-title">Your orders</h5>
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
            <OrderCard
              key={order._id}
              order={order}
              onCancel={openModal}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleCancel}
        onCancel={closeModal}
        message={`Are you sure you want to cancel order #${selectedOrder?._id.slice(-8)}?`}
      />

      {cancelMutation.isError && (
        <div className="error-message">
          Error: {cancelMutation.error?.response?.data?.message ||
                  cancelMutation.error?.response?.data?.error ||
                  cancelMutation.error?.message}
        </div>
      )}
    </div>
  );
}

export default OrdersProfilePage;
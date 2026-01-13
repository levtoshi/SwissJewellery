import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ordersAPI } from "../../../api/orders.js";
import Loader from "../../../components/Loader/Loader.jsx";
import OrderCardAdmin from "../../../components/OrderCardAdmin/OrderCardAdmin.jsx";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import "./OrdersPage.scss";

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await ordersAPI.getAll(),
    staleTime: 3 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => await ordersAPI.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => old.map(c => c._id === id ? { ...c, status: status } : c));
      return { previousOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Order status updated!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['orders'], context.previousCategories);
      toast.error(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await ordersAPI.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      const previousOrders = queryClient.getQueryData(['orders']);
      queryClient.setQueryData(['orders'], (old) => old.filter(c => c._id !== id));
      return { previousOrders };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Order soft deleted!');
    },
    onError: (error, context) => {
      queryClient.setQueryData(['orders'], context.previousCategories);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(errorMessage);
    }
  });

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

  const amountOfOrders = filteredOrders?.length || 0;
  const amountOfActiveOrders = filteredOrders?.filter(order => 
    ['new', 'confirmed', 'assembled', 'shipped'].includes(order.status)
  ).length || 0;
  const amountOfCompletedOrders = filteredOrders?.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  ).length || 0;

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
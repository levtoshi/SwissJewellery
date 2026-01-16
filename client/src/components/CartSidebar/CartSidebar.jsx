import { useCart } from "../../context/CartContext";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./CartSidebar.scss";
import toast from "react-hot-toast";

const CartSidebar = () => {
    const { items, total, removeItem, updateQuantity, clearCart, itemCount, isCartOpen, closeCart } = useCart();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalMessage, setModalMessage] = useState("");

    const openModal = (action, message) => {
        setModalAction(() => action);
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setModalMessage("");
    };

    const confirmAction = () => {
        if (modalAction) {
            modalAction();
        }
        closeModal();
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item._id, item.quantity - 1);
        } else {
            openModal(
                () => removeItem(item._id),
                `Remove "${item.name}" from cart?`
            );
        }
    };

    const handleIncrease = (item) => {
        updateQuantity(item._id, item.quantity + 1);
    };

    const handleToCheckout = () =>
    {
        closeCart();
        navigate("/checkout");
    };

    return (
        <div className={`cart ${isCartOpen ? "open" : ""}`}>
            <div className="cart-header">
                <div className="start-container">
                    <h2>Cart</h2>
                    {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                </div>
                <button className="close-btn" onClick={() => closeCart()}>
                    <X size={24} />
                </button>
            </div>

            {items.length === 0 ? (
                <div className="cart-empty">
                    <p>Cart is empty</p>
                    <p className="hint">Add products</p>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {items.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <span className="item-price">${item.finalPrice || item.price}</span>
                                </div>

                                <div className="item-controls">
                                    <div className="quantity-controls">
                                        <button onClick={() => handleDecrease(item)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleIncrease(item)}>+</button>
                                    </div>

                                    <button
                                        className="btn-remove"
                                        onClick={() => openModal(
                                            () => removeItem(item._id),
                                            `Remove "${item.name}" from cart?`
                                        )}
                                        title="Delete"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="item-total">
                                    ${(item.finalPrice || item.price) * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-footer">
                        <div className="cart-total">
                            <strong>Total:</strong>
                            <strong>${total}</strong>
                        </div>
                        <button className="btn-clear" onClick={() => openModal(
                            () => clearCart(),
                            "Clear all items from cart?"
                        )}>
                            Clear cart
                        </button>
                        <button className="link" onClick={handleToCheckout}>
                            Checkout
                        </button>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={confirmAction}
                onCancel={closeModal}
                message={modalMessage}
                confirmMessage="Yes, Clear"
            />
        </div>
    );
};

export default CartSidebar;
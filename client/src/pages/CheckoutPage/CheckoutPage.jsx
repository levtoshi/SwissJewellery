import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { validateCheckout } from "../../utils/validateCheckout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./CheckoutPage.scss";
import useCreateOrder from "../../hooks/orders/useCreateOrder";

const CheckoutPage = () => {
    const { items, total } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const addMutation = useCreateOrder();

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        comment: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({ ...prev, [name]: value }));

        const fieldErrors = validateCheckout(name, value);

        setErrors(prev => {
            const newErrors = { ...prev, ...fieldErrors };
            if (!fieldErrors[name]) {
                delete newErrors[name];
            }
            return newErrors;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};

        Object.keys(form).forEach((key) => {
            const fieldErrors = validateCheckout(key, form[key]);
            Object.assign(newErrors, fieldErrors);
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Form is not valid");
            return;
        }

        if (items.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        const orderData = {
            items: items.map(item => ({
                product: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            comment: form.comment,
            guestInfo: {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                address: form.address
            }
        };

        addMutation.mutate(orderData);
    };

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="empty-cart">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to proceed with checkout.</p>
                    <button onClick={() => navigate("/")} className="btn-primary">
                        Go to Catalog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-form-section">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">Checkout</h2>
                        <p className="form-subtitle">Fill in your details to complete the order</p>
                        
                        {!isAuthenticated &&
                        <>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Satoshi Nakatomo"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="adam@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <p className="error-text">{errors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+380 097 898 6229"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phone && <p className="error-text">{errors.phone}</p>}
                            </div>
                        </>}
                        

                        <div className="form-group">
                            <label htmlFor="address">Delivery Address *</label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder="Soborna, 20 Kyiv, Ukraine"
                                value={form.address}
                                onChange={handleChange}
                                required
                            ></textarea>
                            {errors.address && <p className="error-text">{errors.address}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="comment">Comment (optional)</label>
                            <textarea
                                id="comment"
                                name="comment"
                                placeholder="Any special instructions..."
                                value={form.comment}
                                onChange={handleChange}
                            ></textarea>
                            {errors.comment && <p className="error-text">{errors.comment}</p>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={addMutation.isPending}>
                            {addMutation.isPending ? "Placing Order..." : "Place Order"}
                        </button>

                        {addMutation.isError && (
                            <div className="error-message">
                                Error: {addMutation.error.response?.data?.message || addMutation.error.response?.data?.error || addMutation.error.message}
                            </div>
                        )}
                    </form>
                </div>

                <div className="order-summary-section">
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <span className="item-price">${item.finalPrice} x {item.quantity}</span>
                                    </div>
                                    <div className="item-total">
                                        ${(item.finalPrice * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-total">
                            <strong>Total: ${total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
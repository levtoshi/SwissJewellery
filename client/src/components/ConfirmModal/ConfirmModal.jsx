import { X, Check } from "lucide-react";
import "./ConfirmModal.scss";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen)
    return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <X size={48} color="#ff4444" />
        </div>

        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={onConfirm}>
            <Check size={16} />
            <span>Yes, Delete</span>
          </button>

          <button className="btn-cancel" onClick={onCancel}>
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
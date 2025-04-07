import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { cancelOrder, selectCancelingOrderStatus } from '../../store/slices/orderSlice';

interface CancelOrderButtonProps {
    orderId: string;
    deliveryDate: string;
}

const CancelOrderButton: React.FC<CancelOrderButtonProps> = ({ orderId, deliveryDate }) => {
    const dispatch = useDispatch<AppDispatch>();
    const cancelStatus = useSelector((state) => selectCancelingOrderStatus(state as any, orderId)); // Use any for state temporarily if type issue

    const isCancelable = () => {
        const today = new Date();
        const delivery = new Date(deliveryDate + 'T00:00:00'); // Ensure correct parsing
        const diffTime = delivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 5;
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            dispatch(cancelOrder(orderId));
        }
    };

    if (!isCancelable()) {
        return null; // Don't show button if not cancelable
    }

    return (
        <button
            onClick={handleCancel}
            disabled={cancelStatus === 'pending'}
            style={cancelStatus === 'failed' ? { backgroundColor: 'red', color: 'white' } : {}}
        >
            {cancelStatus === 'pending' ? 'Canceling...' : cancelStatus === 'failed' ? 'Retry Cancel' : 'Cancel Order'}
        </button>
    );
};

export default CancelOrderButton; 
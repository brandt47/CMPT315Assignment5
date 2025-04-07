import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { cancelOrder, selectCancelingOrderStatus } from '../../../store/slices/orderSlice';

interface CancelOrderButtonProps {
    orderId: string;
    deliveryDate: string;
}

const CancelOrderButton: React.FC<CancelOrderButtonProps> = ({ orderId, deliveryDate }) => {
    const dispatch = useDispatch<AppDispatch>();
    const cancelStatus = useSelector((state) => selectCancelingOrderStatus(state as any, orderId)); // Use any for state temporarily if type issue

    const checkCancelable = () => {
        const today = new Date();
        const delivery = new Date(deliveryDate); // Ensure correct parsing
        const diffTime = delivery.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 5;
    };

    const canCancel = checkCancelable();

    const handleCancel = () => {
        if (canCancel && window.confirm('Are you sure you want to cancel this order?')) {
            dispatch(cancelOrder(orderId));
        }
    };

    const isDisabled = !canCancel || cancelStatus === 'pending';

    const getButtonText = () => {
        if (!canCancel) return "Can't Cancel";
        if (cancelStatus === 'pending') return 'Canceling...';
        return 'Cancel Order';
    };

    const baseClasses = 'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
    const enabledClasses = 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
    const disabledClasses = 'text-gray-500 bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const buttonClasses = `${baseClasses} ${isDisabled ? disabledClasses : enabledClasses}`;

    return (
        <button
            onClick={handleCancel}
            disabled={isDisabled}
            className={buttonClasses}
        >
            {getButtonText()}
        </button>
    );
};

export default CancelOrderButton; 
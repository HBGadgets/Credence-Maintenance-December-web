import React from 'react';
import { CButton, CCard, CCardBody } from '@coreui/react';
import { Check, X } from 'lucide-react';

const LeaveRequests = ({ requests, onApprove, onDeny }) => {
    const pendingRequests = requests.filter((r) => r.status === 'leave-pending');

    if (pendingRequests.length === 0) {
        return <p className="text-muted">No pending leave requests</p>;
    }

    return (
        <div>
            {pendingRequests.map((request) => (
                <CCard key={request.id} className="mb-3">
                    <CCardBody className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className="font-weight-bold">Leave Request</p>
                            <p className="text-muted">Date: {request.date}</p>
                        </div>
                        <div>
                            <CButton
                                color="success"
                                onClick={() => onApprove(request.id)}
                                className="me-2"
                            >
                                <Check size={16} />
                            </CButton>
                            <CButton
                                color="danger"
                                onClick={() => onDeny(request.id)}
                            >
                                <X size={16} />
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            ))}
        </div>
    );
};

export default LeaveRequests;

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig'; // Import your Firebase configuration
import SideBar from './SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Request = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const donationsCollection = collection(db, 'donations');
            const snapshot = await getDocs(donationsCollection);
            const donationList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                status: Math.random() < 0.5 ? 'Accepted' : 'Pending',
            }));
            setRequests(donationList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching donations: ', error);
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        try {
            const donationRef = doc(db, 'donations', id);
            await deleteDoc(donationRef);

            const updatedRequests = requests.filter((request) => request.id !== id);
            setRequests(updatedRequests);
            toast.success('Request rejected successfully');
        } catch (error) {
            console.error('Error rejecting request: ', error);
            toast.error('Error rejecting request');
        }
    };

    const handleAccept = async (id) => {
        try {
            const updatedRequest = { status: 'Accepted' };

            const donationRef = doc(db, 'donations', id);
            await updateDoc(donationRef, updatedRequest);

            const updatedRequests = requests.map((request) => {
                if (request.id === id) {
                    return { ...request, ...updatedRequest };
                }
                return request;
            });

            setRequests(updatedRequests);
            toast.success('Request accepted successfully');
        } catch (error) {
            console.error('Error accepting request: ', error);
            toast.error('Error accepting request');
        }
    };

    const handleEditStatus = async (id, status) => {
        try {
            const updatedRequest = { status };

            const donationRef = doc(db, 'donations', id);
            await updateDoc(donationRef, updatedRequest);

            const updatedRequests = requests.map((request) => {
                if (request.id === id) {
                    return { ...request, ...updatedRequest };
                }
                return request;
            });

            setRequests(updatedRequests);
            toast.success(`Status updated to ${status}`);
        } catch (error) {
            console.error('Error updating status: ', error);
            toast.error('Error updating status');
        }
    };

    return (
        <div className="request">
            <SideBar />
            <div className="requestInner">
                <h1>Request</h1>
                
                {/* Requests Table */}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table border={"1px"} cellPadding={"0px"} cellSpacing={"0px"} width={"500px"}>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Type of</th>
                                <th>Donated By</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => (
                                <tr key={request.id}>
                                    <td height={"40px"}>{index + 1}</td>
                                    <td>{request.type}</td>
                                    <td>{request.donatedBy}</td>
                                    <td>{request.items}</td>
                                    <td style={{ color: request.status === 'Accepted' ? 'green' : 'black' }}>
                                        {request.status}
                                    </td>
                                    <td>
                                        {request.status !== 'Accepted' ? (
                                            <React.Fragment>
                                                <button onClick={() => handleAccept(request.id)}>Accept</button>
                                                <button onClick={() => handleReject(request.id)}>Reject</button>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <button onClick={() => setSelectedRequest(request)}>Edit</button>
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => handleEditStatus(request.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="Accepted">Accepted</option>
                                                </select>
                                            </React.Fragment>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Request;

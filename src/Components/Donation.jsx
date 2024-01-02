import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig'; // Import your Firebase configuration
import SideBar from './SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Donation = () => {
    const [donationType, setDonationType] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [donatedBy, setDonatedBy] = useState('');
    const [donations, setDonations] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedDonationType, setEditedDonationType] = useState('');
    const [editedTotalItems, setEditedTotalItems] = useState(0);
    const [editedDonatedBy, setEditedDonatedBy] = useState('');

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
            }));
            setDonations(donationList);
        } catch (error) {
            console.error('Error fetching donations: ', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDonation = {
                type: donationType,
                items: totalItems,
                donatedBy: donatedBy,
            };

            const donationsCollection = collection(db, 'donations');
            const docRef = await addDoc(donationsCollection, newDonation);

            setDonations([...donations, { id: docRef.id, ...newDonation }]);
            toast.success('Donation added successfully');
            resetForm();
        } catch (error) {
            console.error('Error adding donation: ', error);
            toast.error('Error adding donation');
        }
    };

    const resetForm = () => {
        setDonationType('');
        setTotalItems(0);
        setDonatedBy('');
    };

    const isFormValid = donationType && totalItems > 0 && donatedBy;

    const handleEdit = (id, type, items, donatedBy) => {
        setEditId(id);
        setEditedDonationType(type);
        setEditedTotalItems(items);
        setEditedDonatedBy(donatedBy);
    };

    const handleUpdate = async (id) => {
        try {
            const updatedDonation = {
                type: editedDonationType,
                items: editedTotalItems,
                donatedBy: editedDonatedBy,
            };

            const donationRef = doc(db, 'donations', id);
            await updateDoc(donationRef, updatedDonation);

            const updatedDonations = donations.map((donation) => {
                if (donation.id === id) {
                    return { ...donation, ...updatedDonation };
                }
                return donation;
            });

            setDonations(updatedDonations);
            toast.success('Donation updated successfully');
            setEditId(null);
        } catch (error) {
            console.error('Error updating donation: ', error);
            toast.error('Error updating donation');
        }
    };

    const handleDelete = async (id) => {
        try {
            const donationRef = doc(db, 'donations', id);
            await deleteDoc(donationRef);

            const updatedDonations = donations.filter((donation) => donation.id !== id);
            setDonations(updatedDonations);
            toast.success('Donation deleted successfully');
        } catch (error) {
            console.error('Error deleting donation: ', error);
            toast.error('Error deleting donation');
        }
    };

    return (
        <div className="donation">
            <SideBar />
            <div className="donationInner">
                <h1>Donation</h1>
                <div className="addDonation">
                    <h2>Add Donation</h2>
                    <form className='form' onSubmit={handleSubmit}>
                        <label htmlFor="type">Type of Donation:</label>
                        <input type="text" value={donationType} onChange={(e) => setDonationType(e.target.value)} />
                        <label htmlFor="totalItems">Items:</label>
                        <input type="number" value={totalItems} onChange={(e) => setTotalItems(e.target.value)} />
                        <label htmlFor="donatedBy">Donated By:</label>
                        <input type="text" value={donatedBy} onChange={(e) => setDonatedBy(e.target.value)} />
                        <button type="submit" disabled={!isFormValid}>Add Donation</button>
                    </form>
                </div>

                {/* Donations Table */}
                <h1>Donations</h1>
                <table border={"1px"} cellPadding={"0px"} cellSpacing={"0px"} width={"500px"}>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Type of</th>
                            <th>Donated By</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation, index) => (
                            <tr key={donation.id}>
                                <td height={"40px"}>{index + 1}</td>
                                <td>{editId === donation.id ? (
                                    <input
                                        type="text"
                                        value={editedDonationType}
                                        onChange={(e) => setEditedDonationType(e.target.value)}
                                    />
                                ) : donation.type}</td>
                                <td>{editId === donation.id ? (
                                    <input
                                        type="text"
                                        value={editedDonatedBy}
                                        onChange={(e) => setEditedDonatedBy(e.target.value)}
                                    />
                                ) : donation.donatedBy}</td>
                                <td>{editId === donation.id ? (
                                    <input
                                        type="number"
                                        value={editedTotalItems}
                                        onChange={(e) => setEditedTotalItems(e.target.value)}
                                    />
                                ) : donation.items}</td>
                                <td>
                                    {editId === donation.id ? (
                                        <button onClick={() => handleUpdate(donation.id)}>Update</button>
                                    ) : (
                                        <button onClick={() => handleEdit(donation.id, donation.type, donation.items, donation.donatedBy)}>Edit</button>
                                    )}
                                    <button onClick={() => handleDelete(donation.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Donation;

// dependencies
import React, { useState, useCallback, useEffect } from 'react';
// components
import ListItem from './components/ListItem';
// api
import api from './api';

const ToDoList = () => {
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [currentTitle, setCurrentTitle] = useState(null);
    const [currentDescription, setCurrentDescription] = useState(null);
    const token = localStorage.getItem("token");

    const getAllItems = useCallback(async () => {
        setError(null);
        try {
            const response = await api.get('/all-items', { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data;
            if (data.error) {
                setError(data.error);
            }
            setItems(data.items);
        } catch (e) {
            setError('Could not retrieve items');
        }
    }, [token]);

    const handleAddItem = useCallback(async () => {
        setError(null);
        try {
            const response = await api.post('/to-do-item', { title: currentTitle, description: currentDescription }, { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data;

            if (data.error) {
                setError(data.error);
                return;
            }
            getAllItems();
        } catch (e) {
            setError('Could not add item');
        }
    }, [currentTitle, currentDescription, token, getAllItems]);

    const handleDeleteItem = useCallback(async (itemId) => {
        setError(null);
        try {
            const response = await api.delete(`/items/${itemId}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data;
            if (data.error) {
                setError(data.error);
                return;
            }
            getAllItems();
        } catch (e) {
            setError('Could not delete item');
        }
    }, [token, getAllItems]);

    const handleUpdateItem = useCallback(async (itemId, finished) => {
        setError(null);
        try {
            const response = await api.put(`/items/update/${itemId}`, null, { params: { finished: finished }, headers: { Authorization: `Bearer ${token}` } });
            const data = response.data;
            if (data.error) {
                setError(data.error);
                return;
            }
            getAllItems();
        } catch (e) {
            setError('Could not update item');
        }

    }, [token]);

    useEffect(() => {
        getAllItems();
    }, [getAllItems]);

    return (
        <div className='to-do'>
            <h1>To Do List</h1>
            {error && (
                <div className='error-message'>{error}</div>
            )}
            <div className='input-field'>
                <span>Title</span>
                <input
                    className='title'
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    value={currentTitle}
                />
            </div>
            <div className='input-field'>
                <span>Description</span>
                <input
                    className='title'
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    value={currentDescription}
                />
            </div>
            <button
                onClick={handleAddItem}
            >
                Add Item
            </button>
            {items.map((i) => (
                <ListItem
                    key={i.id}
                    itemId={i.id}
                    title={i.title}
                    description={i.description}
                    finished={i.finished}
                    handleDeleteItem={handleDeleteItem}
                    handleUpdateItem={handleUpdateItem}
                />
            ))}
        </div>
    );
};

export default ToDoList;
// dependencies
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// components
import UserForm from './UserForm';
import ToDoList from './ToDoList';
// styling
import './App.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' exact element={<UserForm />} />
                <Route path='/to-do' exact element={<ToDoList />} />
            </Routes>
        </div>
    );
}

export default App;

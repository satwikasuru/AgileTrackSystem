import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

import './UserProfile.css';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(user => user?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:4000/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleGetHistory = (userId) => {
        setSelectedUser(users.find(user => user?.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (event) => {
        event.preventDefault();

        try {
            await axios.post('http://localhost:4000/users', {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });

            const updatedUsers = await axios.get('http://localhost:4000/users');
            setUsers(updatedUsers.data.filter(user => user?.role !== 'admin'));
            setShowForm(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('employee');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>User Profiles</h2>

            {user?.role === 'admin' && (
                <div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                    >
                        {showForm ? 'Cancel' : 'Add New User'}
                    </button>

                    {showForm && (
                        <form onSubmit={handleAddUser} style={{ textAlign: 'left', maxWidth: '400px', margin: 'auto' }}>
                            <div>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={newUserPassword}
                                    onChange={(e) => setNewUserPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                />
                            </div>
                            <div>
                                <label>Role:</label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%'
                            }}>Create User</button>
                        </form>
                    )}

                    <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px' }}>
                        {users.map(user => (
                            <li key={user?.id} style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <strong>Name:</strong> {user?.name} <br />
                                <strong>Email:</strong> {user?.email} <br />
                                <button 
                                    onClick={() => handleGetHistory(user?.id)}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '5px'
                                    }}
                                >
                                    Get History
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Centered Task History */}
            {(selectedUser || user?.role !== 'admin') && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px',
                    padding: '20px',
                    maxWidth: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textAlign: 'left',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <div>
                        <h3>Task History of {selectedUser?.name || user?.name}</h3>
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {tasks.map(task => (
                                <li key={task.id} style={{
                                    borderBottom: '1px solid #ddd',
                                    padding: '10px 0'
                                }}>
                                    <strong>Title:</strong> {task.title} <br />
                                    <strong>Description:</strong> {task.description} <br />
                                    <strong>Status:</strong> {task.status}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums();
        fetchUsers();
    }, []);

    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
    
            // Fetch tasks related to this scrum
            const tasksResponse = await axios.get(`http://localhost:4000/tasks?scrumId=${scrumId}`);
            setSelectedScrum((prevScrum) => ({
                ...prevScrum,
                tasks: tasksResponse.data,
            }));
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };
    

    const handleAddScrum = async (event) => {
        event.preventDefault();

        try {
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: newScrumName,
            });

            const newScrum = newScrumResponse.data;

            await axios.post('http://localhost:4000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false);
            setNewScrumName('');
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('To Do');
            setNewTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Scrum Teams</h2>
            
            {/* Only show Add New Scrum button if the user is an admin */}
            {user?.role === 'admin' && (
                <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
                    {showForm ? 'Cancel' : 'Add New Scrum'}
                </button>
            )}
    
            {showForm && user?.role === 'admin' && (
                <form onSubmit={handleAddScrum} style={{ marginBottom: '20px' }}>
                    <input type="text" placeholder="Scrum Name" value={newScrumName} onChange={(e) => setNewScrumName(e.target.value)} required />
                    <input type="text" placeholder="Task Title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
                    <input type="text" placeholder="Task Description" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} required />
                    <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)}>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <select value={newTaskAssignedTo} onChange={(e) => setNewTaskAssignedTo(e.target.value)}>
                        <option value="">Assign To</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button type="submit">Create Scrum</button>
                </form>
            )}
    
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {scrums.map((scrum) => (
                    <div key={scrum.id} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '15px',
                        width: '250px',
                        textAlign: 'center',
                        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff'
                    }}>
                        <h3>{scrum.name}</h3>
                        <button 
                            onClick={() => handleGetDetails(scrum.id)}
                            style={{
                                marginTop: '10px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}
                        >
                            Get Details
                        </button>
                    </div>
                ))}
            </div>
    
            {selectedScrum && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '30px',
                    padding: '20px',
                    maxWidth: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <ScrumDetails scrum={selectedScrum} />
                </div>
            )}
        </div>
    );
    
};

export default Dashboard;


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthTest = () => {
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const [mockUser, setMockUser] = useState(false);

    // Temp mock function until Firebase is fully config
    const mockLogin = () => {
        setMockUser(true);
        // We need to manually simulate this in the context for now if firebase isn't active
        // But since context relies on onAuthStateChanged, we should fix the context
    }

    return (
        <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'white', padding: 10, border: '1px solid black', zIndex: 9999 }}>
            <p>Auth Status: {currentUser ? 'Logged In' : 'Logged Out'}</p>
            {!currentUser && <button onClick={loginWithGoogle}>Login Google</button>}
            {currentUser && <button onClick={logout}>Logout</button>}
        </div>
    )
}
export default AuthTest;

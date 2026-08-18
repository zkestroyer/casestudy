import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{textAlign: 'center', marginBottom: '1.5rem'}}>System Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={{color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem'}}>{error}</div>}
          <FormInput label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <FormInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;

import React, { FormEvent, useState } from 'react';
import './LoginForm.css';

interface LoginProps {
    onLogin: (username: string, email: string) => void;
  }

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    onLogin(username, email);
  };

  return (
    <form
        className="loginForm"
        onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="loginInput"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        className="loginInput"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
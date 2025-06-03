import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './AuthStyles';
import { authService } from '../../services/authService';

const Auth = () => {
  const [signIn, toggle] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Remove the useEffect that checks for authentication status
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSignIn = async (e) => {
  e.preventDefault();
  setError('');
  try {
    // Attempt login
    const userData = await authService.login(formData.email, formData.password);
    
    // Save user data to database/localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    setMessage('Sign in successful! Redirecting...');
    setTimeout(() => {
      const redirectTo = location.state?.redirectTo || '/shop';
      navigate(redirectTo);
    }, 1500);
  } catch (err) {
    setError('Invalid credentials');
    console.error('Login error:', err);
  }
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const userData = await authService.register(formData.username, formData.email, formData.password);
    if (userData) {
      setMessage('Registration successful! Please sign in.');
      toggle(true); // Switch to sign in form
      setFormData({ ...formData, username: '' }); // Clear username but keep email
    }
  } catch (err) {
    setError('Registration failed. Please try again.');
    console.error('Registration error:', err);
  }
};

return (
  <S.Container>
    {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    {message && <S.SuccessMessage>{message}</S.SuccessMessage>}
    <S.SignUpContainer signinIn={signIn}>
      <S.Form onSubmit={handleSignUp}>
        <S.Title>Create Account</S.Title>
        <S.Input 
          type='text'
          name="username"
          placeholder='Name'
          value={formData.username}
          onChange={handleChange}
        />
        <S.Input 
          type='email'
          name="email"
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />
        <S.Input 
          type='password'
          name="password"
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
        />
        <S.Button type="submit">Sign Up</S.Button>
      </S.Form>
    </S.SignUpContainer>

      <S.SignInContainer signinIn={signIn}>
        <S.Form onSubmit={handleSignIn}>
          <S.Title>Sign in</S.Title>
          <S.Input 
            type='email'
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
          />
          <S.Input 
            type='password'
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
          <S.Anchor href='#'>Forgot your password?</S.Anchor>
          <S.Button type="submit">Sign In</S.Button>
        </S.Form>
      </S.SignInContainer>

      <S.OverlayContainer signinIn={signIn}>
        <S.Overlay signinIn={signIn}>
          <S.LeftOverlayPanel signinIn={signIn}>
            <S.Title>Welcome Back!</S.Title>
            <S.Paragraph>
              To keep connected with us please login with your personal info
            </S.Paragraph>
            <S.GhostButton onClick={() => toggle(true)}>
              Sign In
            </S.GhostButton>
          </S.LeftOverlayPanel>

          <S.RightOverlayPanel signinIn={signIn}>
            <S.Title>Hello, Friend!</S.Title>
            <S.Paragraph>
              Enter your personal details and start journey with us
            </S.Paragraph>
            <S.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </S.GhostButton>
          </S.RightOverlayPanel>
        </S.Overlay>
      </S.OverlayContainer>
    </S.Container>
  );
};

export default Auth;
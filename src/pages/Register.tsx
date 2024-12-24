// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { registerUser } from '../utils/firebase.ts';

// const RegisterContainer = styled.div`
//   max-width: 400px;
//   margin: 2rem auto;
//   padding: 2rem;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const Input = styled.input`
//   padding: 0.75rem;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   font-size: 1rem;
// `;

// const Button = styled.button`
//   padding: 0.75rem;
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   border: none;
//   border-radius: 4px;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: ${(props) => props.theme.colors.primaryDark};
//   }
// `;

// const ErrorMessage = styled.p`
//   color: red;
//   margin-top: 1rem;
// `;

// const LoginLink = styled(Link)`
//   display: block;
//   margin-top: 1rem;
//   text-align: center;
//   color: ${(props) => props.theme.colors.primary};
// `;

// export const Register: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       await registerUser(email, password);
//       navigate('/');
//     } catch (error) {
//       setError('Failed to create an account. Please try again.');
//     }
//   };

//   return (
//     <RegisterContainer>
//       <h1>Create Account</h1>
//       <Form onSubmit={handleSubmit}>
//         <Input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <Input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <Input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />
//         <Button type="submit">Sign Up</Button>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
//       </Form>
//       <LoginLink to="/login">Already have an account? Log in</LoginLink>
//     </RegisterContainer>
//   );
// };
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { registerUser } from '../utils/firebase.ts';

// Reuse the styled components from Login.tsx

const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => props.theme.colors.primary};
`;

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerUser(email, password);
      navigate('/');
    } catch (error) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <RegisterContainer>
      <h1>Create Account</h1>
      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Create Account</Button>
      </Form>
      <LoginLink to="/login">Already have an account? Login</LoginLink>
    </RegisterContainer>
  );
};

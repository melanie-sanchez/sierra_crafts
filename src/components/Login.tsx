import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from '../utils/firebase.ts';

const LoginContainer = styled.div`
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

const SignUpLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: ${(props) => props.theme.colors.primary};
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
`;

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <LoginContainer>
      <h1>Login</h1>
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
        <Button type="submit">Login</Button>
      </Form>
      <ForgotPasswordLink
        to={`/forgot-password?email=${encodeURIComponent(email)}`}
      >
        Forgot Password?
      </ForgotPasswordLink>
      <SignUpLink to="/register">Don't have an account? Sign up</SignUpLink>
    </LoginContainer>
  );
};

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { loginUser } from '../utils/firebase.ts';
// import { Link, useNavigate, useLocation } from 'react-router-dom';

// const LoginContainer = styled.div`
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
//   text-align: center;
// `;

// const SignUpLink = styled(Link)`
//   display: block;
//   text-align: center;
//   margin-top: 1rem;
//   color: ${(props) => props.theme.colors.primary};
// `;

// const ForgotPasswordLink = styled(Link)`
//   display: block;
//   text-align: center;
//   margin-top: 0.5rem;
//   color: ${(props) => props.theme.colors.primary};
// `;

// export const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await loginUser(email, password);
//       navigate('/');
//     } catch (error) {
//       if (error.code === 'auth/user-not-found') {
//         setError('No user found with this email address.');
//       } else if (error.code === 'auth/wrong-password') {
//         setError('Incorrect password. Please try again.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('The email address is not valid.');
//       } else {
//         setError('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <LoginContainer>
//       <h1>Login</h1>
//       <Form onSubmit={handleSubmit}>
//         {error && <ErrorMessage>{error}</ErrorMessage>}
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
//         <Button type="submit">Login</Button>
//       </Form>
//       <ForgotPasswordLink to="/forgot-password" state={{ email: email }}>
//         Forgot Password?
//       </ForgotPasswordLink>
//       <SignUpLink to="/register">Don't have an account? Sign up</SignUpLink>
//     </LoginContainer>
//   );
// };

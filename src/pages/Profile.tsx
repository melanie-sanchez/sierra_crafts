import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getOrdersByUser } from '../utils/firebase.ts';
import { Order } from '../types';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const OrdersList = styled.div`
  margin-top: 2rem;
`;

const OrderItem = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        const userOrders = await getOrdersByUser(user.uid);
        setOrders(userOrders);
      };
      fetchOrders();
    }
  }, [user]);

  if (!user) return <div>Please log in to view your profile</div>;

  return (
    <ProfileContainer>
      <h1>My Profile</h1>
      <p>Email: {user.email}</p>

      <OrdersList>
        <h2>My Orders</h2>
        {orders.map((order) => (
          <OrderItem key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount.toFixed(2)}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          </OrderItem>
        ))}
      </OrdersList>
    </ProfileContainer>
  );
};

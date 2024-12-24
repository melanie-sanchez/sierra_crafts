import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getUserOrders } from '../utils/firebase.ts';
import { Link } from 'react-router-dom';

const OrdersContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const OrderCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderNumber = styled.h3`
  margin: 0;
  font-weight: bold;
`;

const OrderStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${(props) => {
    switch (props.status) {
      case 'processing':
        return '#ffd700';
      case 'in-route':
        return '#1e90ff';
      case 'delivered':
        return '#32cd32';
      default:
        return '#808080';
    }
  }};
  color: white;
  display: inline-block;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

export const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <OrdersContainer>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} to={`/order/${order.id}`}>
          <OrderHeader>
            <OrderNumber>Order #{order.id}</OrderNumber>
            <OrderStatus status={order.status}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </OrderStatus>
          </OrderHeader>
          <OrderInfo>
            <span>{new Date(order.date).toLocaleDateString()}</span>
            <span>{order.items.length} item(s)</span>
          </OrderInfo>
        </OrderCard>
      ))}
    </OrdersContainer>
  );
};

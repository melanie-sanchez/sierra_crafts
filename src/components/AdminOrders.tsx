import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  getOrders,
  updateOrderStatus,
  getProductDetails,
} from '../utils/firebase.ts';

import { getCardLogo } from '../utils/cardLogos.ts';

const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  padding: 1rem;
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

const StatusSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${(props) => {
    switch (props.value) {
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
  border: none;
  cursor: pointer;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const OrderDetails = styled.div`
  margin-top: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const AddressSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const PaymentSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CardLogo = styled.img`
  height: 24px;
  width: auto;
`;

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const allOrders = await getOrders();
      setOrders(allOrders);

      // Fetch all unique product details
      const productIds = [
        ...new Set(
          allOrders.flatMap((order) => order.items.map((item) => item.id))
        ),
      ];
      const productPromises = productIds.map((id) => getProductDetails(id));
      const productDetails = await Promise.all(productPromises);
      const productMap = {};
      productDetails.forEach((product) => {
        productMap[product.id] = product;
      });
      setProducts(productMap);
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    // Update local state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <OrdersContainer>
      <h2>All Orders</h2>
      {orders.map((order) => (
        <OrderCard key={order.id}>
          <OrderHeader>
            <OrderNumber>Order #{order.id}</OrderNumber>
            <StatusSelect
              value={order.status}
              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
            >
              <option value="processing">Processing</option>
              <option value="in-route">In Route</option>
              <option value="delivered">Delivered</option>
            </StatusSelect>
          </OrderHeader>
          <OrderInfo>
            <span>{new Date(order.date).toLocaleDateString()}</span>
            <span>{order.items.length} item(s)</span>
          </OrderInfo>
          <OrderDetails>
            <h4>Customer Information:</h4>
            <p>Email: {order.userEmail}</p>

            <AddressSection>
              <h4>Shipping Address:</h4>
              <AddressGrid>
                <p>
                  <strong>Street:</strong> {order.shippingAddress?.street}
                </p>
                <p>
                  <strong>City:</strong> {order.shippingAddress?.city}
                </p>
                <p>
                  <strong>State:</strong> {order.shippingAddress?.state}
                </p>
                <p>
                  <strong>ZIP:</strong> {order.shippingAddress?.zipCode}
                </p>
                <p>
                  <strong>Country:</strong> {order.shippingAddress?.country}
                </p>
              </AddressGrid>
            </AddressSection>

            <PaymentSection>
              <h4>Payment Information:</h4>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                {order.paymentDetails?.cardType && (
                  <CardLogo
                    src={getCardLogo(order.paymentDetails.cardType)}
                    alt={order.paymentDetails.cardType}
                  />
                )}
                <p>Card ending in {order.paymentDetails?.lastFourDigits}</p>
              </div>
            </PaymentSection>

            <h4>Order Details:</h4>
            {order.items.map((item, index) => (
              <OrderItem key={index}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ItemImage
                    src={
                      products[item.id]?.imageUrl ||
                      '/path/to/placeholder-image.jpg'
                    }
                    alt={item.name}
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </OrderItem>
            ))}

            <div
              style={{
                marginTop: '1rem',
                borderTop: '1px solid #eee',
                paddingTop: '1rem',
              }}
            >
              <p>
                <strong>Subtotal:</strong> ${order.subtotal?.toFixed(2)}
              </p>
              <p>
                <strong>Tax:</strong> ${order.taxes?.toFixed(2)}
              </p>
              <p>
                <strong>Shipping:</strong> ${order.shippingFee?.toFixed(2)}
              </p>
              <h4>Total: ${order.total?.toFixed(2)}</h4>
            </div>
          </OrderDetails>
        </OrderCard>
      ))}
    </OrdersContainer>
  );
};

// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { getOrderDetails, getProductDetails } from '../utils/firebase.ts';
// import { getCardLogo } from '../utils/cardLogos.ts';

// const OrderDetailsContainer = styled.div`
//   max-width: 800px;
//   margin: 2rem auto;
//   padding: 2rem;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const OrderItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
//   padding-bottom: 1rem;
//   border-bottom: 1px solid #eee;
// `;

// const ItemImage = styled.img`
//   width: 80px;
//   height: 80px;
//   object-fit: cover;
//   border-radius: 4px;
//   margin-right: 1rem;
// `;

// const OrderTotal = styled.h3`
//   text-align: right;
//   margin-top: 1rem;
// `;

// const BackButton = styled(Link)`
//   display: inline-block;
//   margin-bottom: 1rem;
//   padding: 0.5rem 1rem;
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   text-decoration: none;
//   border-radius: 4px;
// `;

// const AddressSection = styled.div`
//   margin: 1rem 0;
//   padding: 1rem;
//   background-color: #f8f9fa;
//   border-radius: 4px;
// `;

// const AddressGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 0.5rem;
// `;

// const PaymentSection = styled.div`
//   margin: 1rem 0;
//   padding: 1rem;
//   background-color: #f8f9fa;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const CardLogo = styled.img`
//   height: 24px;
//   width: auto;
// `;

// const StatusBadge = styled.span`
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   font-weight: bold;
//   background-color: ${(props) => {
//     switch (props.status) {
//       case 'processing':
//         return '#ffd700';
//       case 'in-route':
//         return '#1e90ff';
//       case 'delivered':
//         return '#32cd32';
//       default:
//         return '#808080';
//     }
//   }};
//   color: white;
// `;

// export const OrderDetails: React.FC = () => {
//   const [order, setOrder] = useState(null);
//   const [products, setProducts] = useState({});
//   const { orderId } = useParams();

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       const orderDetails = await getOrderDetails(orderId);
//       setOrder(orderDetails);

//       // Fetch product details for each item in the order
//       const productPromises = orderDetails.items.map((item) =>
//         getProductDetails(item.id)
//       );
//       const productDetails = await Promise.all(productPromises);
//       const productMap = {};
//       productDetails.forEach((product) => {
//         productMap[product.id] = product;
//       });
//       setProducts(productMap);
//     };
//     fetchOrderDetails();
//   }, [orderId]);

//   if (!order) return <div>Loading...</div>;

//   return (
//     <OrderDetailsContainer>
//       <BackButton to="/my-orders">&larr; Back to Orders</BackButton>

//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <h1>Order #{orderId}</h1>
//         <StatusBadge status={order.status}>
//           {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
//         </StatusBadge>
//       </div>

//       <p>Date: {new Date(order.date).toLocaleDateString()}</p>

//       <AddressSection>
//         <h2>Shipping Address</h2>
//         <AddressGrid>
//           <p>
//             <strong>Street:</strong> {order.shippingAddress?.street}
//           </p>
//           <p>
//             <strong>City:</strong> {order.shippingAddress?.city}
//           </p>
//           <p>
//             <strong>State:</strong> {order.shippingAddress?.state}
//           </p>
//           <p>
//             <strong>ZIP:</strong> {order.shippingAddress?.zipCode}
//           </p>
//           <p>
//             <strong>Country:</strong> {order.shippingAddress?.country}
//           </p>
//         </AddressGrid>
//       </AddressSection>

//       <PaymentSection>
//         <h2>Payment Information</h2>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//           {order.paymentDetails?.cardType && (
//             <CardLogo
//               src={getCardLogo(order.paymentDetails.cardType)}
//               alt={order.paymentDetails.cardType}
//             />
//           )}
//           <p>Card ending in {order.paymentDetails?.lastFourDigits}</p>
//         </div>
//       </PaymentSection>

//       <h2>Items</h2>
//       {order.items.map((item) => (
//         <OrderItem key={item.id}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <ItemImage
//               src={
//                 products[item.id]?.imageUrl || '/path/to/placeholder-image.jpg'
//               }
//               alt={item.name}
//             />
//             <div>
//               <h3>{item.name}</h3>
//               <p>Quantity: {item.quantity}</p>
//             </div>
//           </div>
//           <p>${(item.price * item.quantity).toFixed(2)}</p>
//         </OrderItem>
//       ))}

//       <div
//         style={{
//           marginTop: '1rem',
//           borderTop: '1px solid #eee',
//           paddingTop: '1rem',
//         }}
//       >
//         <p>
//           <strong>Subtotal:</strong> ${order.subtotal?.toFixed(2)}
//         </p>
//         <p>
//           <strong>Tax:</strong> ${order.taxes?.toFixed(2)}
//         </p>
//         <p>
//           <strong>Shipping:</strong> ${order.shippingFee?.toFixed(2)}
//         </p>
//         <OrderTotal>Total: ${order.total?.toFixed(2)}</OrderTotal>
//       </div>
//     </OrderDetailsContainer>
//   );
// };

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getOrderDetails, getProductDetails } from '../utils/firebase.ts';
import { getCardLogo } from '../utils/cardLogos.ts';

const OrderDetailsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const OrderTotal = styled.h3`
  text-align: right;
  margin-top: 1rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
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

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
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
`;

export const OrderDetails: React.FC = () => {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderDetails = await getOrderDetails(orderId);
      setOrder(orderDetails);

      // Fetch product details for each item in the order
      const productPromises = orderDetails.items.map((item) =>
        getProductDetails(item.id)
      );
      const productDetails = await Promise.all(productPromises);
      const productMap = {};
      productDetails.forEach((product) => {
        productMap[product.id] = product;
      });
      setProducts(productMap);
    };
    fetchOrderDetails();
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <OrderDetailsContainer>
      <BackButton to="/my-orders">&larr; Back to Orders</BackButton>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Order #{orderId}</h1>
        <StatusBadge status={order.status}>
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </StatusBadge>
      </div>

      <p>Date: {new Date(order.date).toLocaleDateString()}</p>

      <AddressSection>
        <h2>Shipping Address</h2>
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
        <h2>Payment Information</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {order.paymentDetails?.cardType && (
            <CardLogo
              src={getCardLogo(order.paymentDetails.cardType)}
              alt={order.paymentDetails.cardType}
            />
          )}
          <p>Card ending in {order.paymentDetails?.lastFourDigits}</p>
        </div>
      </PaymentSection>

      <h2>Items</h2>
      {order.items.map((item) => (
        <OrderItem key={item.id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ItemImage
              src={
                products[item.id]?.imageUrl || '/path/to/placeholder-image.jpg'
              }
              alt={item.name}
            />
            <div>
              <h3>{item.name}</h3>
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
        <OrderTotal>Total: ${order.total?.toFixed(2)}</OrderTotal>
      </div>
    </OrderDetailsContainer>
  );
};

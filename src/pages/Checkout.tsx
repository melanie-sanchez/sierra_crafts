import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { createOrder } from '../utils/firebase.ts';
import valid from 'card-validator';
import { getCardLogo } from '../utils/cardLogos.ts';

const CheckoutContainer = styled.div`
  max-width: 800px;
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

const Button = styled.button`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const OrderSummary = styled.div`
  margin-top: 2rem;
`;

const CardInputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CardLogo = styled.img`
  position: absolute;
  right: 10px;
  height: 24px;
  width: auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  padding-right: ${(props) =>
    props.hasLogo ? '40px' : '0.5rem'}; // Add space for logo
`;
export const Checkout: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [cardType, setCardType] = useState('');

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const taxRate = 0.08; // 8% tax rate, adjust as needed
  const taxes = subtotal * taxRate;
  const shippingFee = 5.99; // Flat shipping fee, adjust as needed
  const total = subtotal + taxes + shippingFee;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });

    if (name === 'cardNumber') {
      // Remove any spaces or special characters
      const cleanValue = value.replace(/\D/g, '');
      const numberValidation = valid.number(cleanValue);

      if (numberValidation.card) {
        setCardType(numberValidation.card.type);
      } else {
        setCardType('');
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (match) {
      return [match[1], match[2], match[3], match[4]]
        .filter((group) => group)
        .join(' ');
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    const order = {
      userId: user.uid,
      userEmail: user.email,
      shippingAddress: shippingInfo,
      items: cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      })),
      paymentDetails: {
        lastFourDigits: paymentInfo.cardNumber.slice(-4),
        cardType: cardType,
      },
      subtotal,
      taxes,
      shippingFee,
      total,
      status: 'processing',
      date: new Date().toISOString(),
    };

    try {
      await createOrder(order);
      alert('Order placed successfully!');
      cartItems.forEach((item) => removeFromCart(item.product.id));
      navigate('/my-orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      <Form onSubmit={handleSubmit}>
        <section>
          <h2>Shipping Information</h2>
          <FormGroup>
            <Label>Street Address</Label>
            <Input
              type="text"
              name="street"
              value={shippingInfo.street}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>State</Label>
            <Input
              type="text"
              name="state"
              value={shippingInfo.state}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>ZIP Code</Label>
            <Input
              type="text"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
        </section>

        <section>
          <h2>Payment Information</h2>
          <FormGroup>
            <Label>Card Number</Label>
            <CardInputGroup>
              <Input
                type="text"
                name="cardNumber"
                value={formatCardNumber(paymentInfo.cardNumber)}
                onChange={handlePaymentChange}
                maxLength={19} // 16 digits + 3 spaces
                placeholder="1234 5678 9012 3456"
                hasLogo={!!cardType}
                required
              />
              {cardType && (
                <CardLogo src={getCardLogo(cardType)} alt={cardType} />
              )}
            </CardInputGroup>
          </FormGroup>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <FormGroup>
              <Label>Expiry Date</Label>
              <Input
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    const formattedValue = value
                      .replace(/(\d{2})(\d{0,2})/, '$1/$2')
                      .slice(0, 5);
                    setPaymentInfo({
                      ...paymentInfo,
                      expiryDate: formattedValue,
                    });
                  }
                }}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>CVV</Label>
              <Input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setPaymentInfo({
                      ...paymentInfo,
                      cvv: value,
                    });
                  }
                }}
                placeholder="123"
                maxLength={4}
                required
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Cardholder Name</Label>
            <Input
              type="text"
              name="cardHolder"
              value={paymentInfo.cardHolder}
              onChange={handlePaymentChange}
              placeholder="John Doe"
              required
            />
          </FormGroup>
        </section>

        <OrderSummary>
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.product.id}>
              {item.product.name} - Quantity: {item.quantity} - $
              {(item.product.price * item.quantity).toFixed(2)}
            </div>
          ))}
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Taxes: ${taxes.toFixed(2)}</div>
          <div>Shipping: ${shippingFee.toFixed(2)}</div>
          <h3>Total: ${total.toFixed(2)}</h3>
        </OrderSummary>
        <Button type="submit">Place Order</Button>
      </Form>
    </CheckoutContainer>
  );
};

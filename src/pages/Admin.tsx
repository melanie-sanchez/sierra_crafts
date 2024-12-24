import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AdminProductForm } from '../components/AdminProductForm.tsx';
import { AdminEventForm } from '../components/AdminEventForm.tsx';
import {
  getAllProducts,
  deleteProduct,
  getEvents,
  deleteEvent,
} from '../utils/firebase.ts';
import { Product, Event } from '../types';
import { AdminOrders } from '../components/AdminOrders.tsx';
import { AdminBannerSettings } from '../components/AdminBannerSettings.tsx';

const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: ${(props) =>
      props.theme.colors.text}; // This ensures the title is visible
    margin-bottom: 2rem;
  }
`;

const ProductList = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  background-color: ${(props) =>
    props.variant === 'delete'
      ? '#dc3545'
      : props.variant === 'edit'
      ? '#ffc107'
      : props.theme.colors.primary};
  color: ${(props) => (props.variant === 'edit' ? '#000' : '#fff')};

  &:hover {
    opacity: 0.9;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => (props.active ? 'white' : props.theme.colors.primary)};
  border: 1px solid ${(props) => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};
    color: white;
  }
`;

export const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined
  );
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const fetchProducts = async () => {
    const fetchedProducts = await getAllProducts();
    setProducts(fetchedProducts);
  };

  const fetchEvents = async () => {
    const fetchedEvents = await getEvents();
    setEvents(fetchedEvents);
  };

  useEffect(() => {
    fetchProducts();
    fetchEvents();
  }, []);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAdding(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsAdding(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      fetchEvents();
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(undefined);
    setSelectedEvent(undefined);
    setIsAdding(true);
  };

  const onProductSaved = () => {
    setSelectedProduct(undefined);
    setIsAdding(false);
    fetchProducts();
  };

  const onEventSaved = () => {
    setSelectedEvent(undefined);
    setIsAdding(false);
    fetchEvents();
  };

  return (
    <AdminContainer>
      <h1>Admin Dashboard</h1>

      <TabContainer>
        <Tab
          active={activeTab === 'products'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </Tab>
        <Tab
          active={activeTab === 'events'}
          onClick={() => setActiveTab('events')}
        >
          Events
        </Tab>
        <Tab
          active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </Tab>
        <Tab
          active={activeTab === 'banner'}
          onClick={() => setActiveTab('banner')}
        >
          Banner
        </Tab>
      </TabContainer>

      {activeTab === 'products' && (
        <>
          <button onClick={handleAddNew}>Add New Product</button>

          {(selectedProduct || isAdding) && (
            <AdminProductForm
              product={selectedProduct}
              onProductSaved={onProductSaved}
            />
          )}

          <h2>Product List</h2>
          <ProductList>
            {products.map((product) => (
              <ProductItem key={product.id}>
                <span>
                  {product.name} - ${product.price}
                </span>
                <div>
                  <ActionButton onClick={() => handleEditProduct(product)}>
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </ActionButton>
                </div>
              </ProductItem>
            ))}
          </ProductList>
        </>
      )}

      {activeTab === 'events' && (
        <>
          <button onClick={handleAddNew}>Add New Event</button>

          {(selectedEvent || isAdding) && (
            <AdminEventForm event={selectedEvent} onEventSaved={onEventSaved} />
          )}

          <h2>Event List</h2>
          <ProductList>
            {events.map((event) => (
              <ProductItem key={event.id}>
                <span>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </span>
                <div>
                  <ActionButton onClick={() => handleEditEvent(event)}>
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </ActionButton>
                </div>
              </ProductItem>
            ))}
          </ProductList>
        </>
      )}

      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'banner' && <AdminBannerSettings />}
    </AdminContainer>
  );
};

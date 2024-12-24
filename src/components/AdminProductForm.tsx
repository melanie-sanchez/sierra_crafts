import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Product } from '../types';
import { addProduct, updateProduct, uploadImage } from '../utils/firebase.ts';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}33;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}33;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface AdminProductFormProps {
  product?: Product;
  onProductSaved: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  onProductSaved,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: 'candles',
    quantity: 0,
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'quantity' ? parseFloat(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      console.log('Starting form submission...'); // Debug log

      let imageUrl = formData.imageUrl;

      if (imageFile) {
        console.log('Uploading image...'); // Debug log
        imageUrl = await uploadImage(imageFile);
        console.log('Image uploaded:', imageUrl); // Debug log
      }

      const productData = { ...formData, imageUrl };
      console.log('Product data to submit:', productData); // Debug log

      if (product?.id) {
        await updateProduct(product.id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await addProduct(productData as Omit<Product, 'id'>);
        setSuccess('Product added successfully!');
      }

      // Clear form after successful submission
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: 'candles',
        quantity: 0,
        imageUrl: '',
      });
      setImageFile(null);

      onProductSaved();
    } catch (error) {
      console.error('Error in form submission:', error); // Debug log
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the product'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Product Name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Price</Label>
        <Input
          type="number"
          name="price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Description</Label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Category</Label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="candles">Candles</option>
          <option value="earrings">Earrings</option>
          <option value="stickers">Stickers</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Quantity</Label>
        <Input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Product Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
      </FormGroup>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Saving...'
          : product
          ? 'Update Product'
          : 'Add Product'}
      </Button>
    </FormContainer>
  );
};

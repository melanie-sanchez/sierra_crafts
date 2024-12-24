import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  setBannerSettings,
  getBannerSettings,
  uploadBannerImage,
} from '../utils/firebase.ts';

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
`;

const ImagePreview = styled.img`
  max-width: 200px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

const FormContainer = styled.form`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

export const AdminBannerSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    isEnabled: false,
    title: '',
    message: '',
    linkUrl: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const currentSettings = await getBannerSettings();
      if (currentSettings) {
        setSettings(currentSettings);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setSettings((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedSettings = { ...settings };

      if (imageFile) {
        const imageUrl = await uploadBannerImage(imageFile);
        updatedSettings.imageUrl = imageUrl;
      }

      await setBannerSettings(updatedSettings);
      alert('Banner settings updated successfully!');
    } catch (error) {
      console.error('Error updating banner settings:', error);
      alert('Error updating banner settings');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h3>Promotional Banner Settings</h3>
      <FormGroup>
        <Label>
          <input
            type="checkbox"
            name="isEnabled"
            checked={settings.isEnabled}
            onChange={handleChange}
          />
          Enable Promotional Pop-up/Banner
        </Label>
      </FormGroup>
      <FormGroup>
        <Label>Title:</Label>
        <Input
          type="text"
          name="title"
          value={settings.title}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Message:</Label>
        <TextArea
          name="message"
          value={settings.message}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Link URL (optional):</Label>
        <Input
          type="text"
          name="linkUrl"
          value={settings.linkUrl}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>Banner Image (optional):</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {(imageFile || settings.imageUrl) && (
          <ImagePreviewContainer>
            <ImagePreview
              src={
                imageFile ? URL.createObjectURL(imageFile) : settings.imageUrl
              }
              alt="Banner preview"
            />
            <RemoveImageButton type="button" onClick={handleRemoveImage}>
              ×
            </RemoveImageButton>
          </ImagePreviewContainer>
        )}
      </FormGroup>

      <SubmitButton type="submit">Save Settings</SubmitButton>
    </FormContainer>
  );
};

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getBannerSettings } from '../utils/firebase.ts';

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
`;

const PopupTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.primary};
`;

const PopupMessage = styled.p`
  margin-bottom: 1rem;
`;

const PopupButton = styled.button`
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

const PopupContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const BannerImage = styled.img`
  max-width: 100%;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

export const PromoBanner: React.FC = () => {
  const [bannerSettings, setBannerSettings] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchBannerSettings = async () => {
      const settings = await getBannerSettings();
      setBannerSettings(settings);
    };
    fetchBannerSettings();
  }, []);

  if (!bannerSettings || !bannerSettings.isEnabled) return null;

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowBanner(true);
  };

  const handleClick = () => {
    if (bannerSettings.linkUrl) {
      window.location.href = bannerSettings.linkUrl;
    }
  };

  return (
    <>
      {showPopup && (
        <PopupOverlay>
          <PopupContent>
            <CloseButton onClick={handlePopupClose}>&times;</CloseButton>
            {bannerSettings.imageUrl && (
              <BannerImage
                src={bannerSettings.imageUrl}
                alt={bannerSettings.title}
              />
            )}
            <PopupTitle>{bannerSettings.title}</PopupTitle>
            <PopupMessage>{bannerSettings.message}</PopupMessage>
            {bannerSettings.linkUrl && (
              <PopupButton onClick={handleClick}>Learn More</PopupButton>
            )}
          </PopupContent>
        </PopupOverlay>
      )}
      {showBanner && !showPopup && (
        <BannerContainer onClick={() => setShowPopup(true)}>
          {bannerSettings.imageUrl && (
            <img
              src={bannerSettings.imageUrl}
              alt=""
              style={{ height: '20px', marginRight: '10px' }}
            />
          )}
          {bannerSettings.message}
        </BannerContainer>
      )}
    </>
  );
};

// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { getBannerSettings } from '../utils/firebase.ts';

// const BannerContainer = styled.div`
//   background-color: ${(props) => props.theme.colors.secondary};
//   color: ${(props) => props.theme.colors.text};
//   padding: 0.5rem;
//   text-align: center;
//   cursor: pointer;
//   font-weight: bold;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// const PopupOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// `;

// const PopupContent = styled.div`
//   background-color: white;
//   padding: 2rem;
//   border-radius: 8px;
//   max-width: 500px;
//   width: 90%;
//   position: relative;
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: none;
//   border: none;
//   font-size: 1.5rem;
//   cursor: pointer;
//   color: ${(props) => props.theme.colors.text};
// `;

// const PopupTitle = styled.h2`
//   margin-bottom: 1rem;
//   color: ${(props) => props.theme.colors.primary};
// `;

// const PopupMessage = styled.p`
//   margin-bottom: 1rem;
// `;

// const PopupButton = styled.button`
//   background-color: ${(props) => props.theme.colors.primary};
//   color: white;
//   border: none;
//   padding: 0.5rem 1rem;
//   border-radius: 4px;
//   cursor: pointer;

//   &:hover {
//     background-color: ${(props) => props.theme.colors.primaryDark};
//   }
// `;

// const BannerImage = styled.img`
//   max-width: 100%;
//   max-height: 200px;
//   object-fit: cover;
//   margin-bottom: 1rem;
// `;

// const PopupImage = styled.img`
//   max-width: 100%;
//   max-height: 300px;
//   object-fit: cover;
//   margin-bottom: 1rem;
// `;

// export const PromoBanner: React.FC = () => {
//   const [bannerSettings, setBannerSettings] = useState(null);
//   const [showPopup, setShowPopup] = useState(true);
//   const [showBanner, setShowBanner] = useState(false);

//   useEffect(() => {
//     const fetchBannerSettings = async () => {
//       const settings = await getBannerSettings();
//       setBannerSettings(settings);
//     };
//     fetchBannerSettings();
//   }, []);

//   if (!bannerSettings || !bannerSettings.isEnabled) return null;

//   const handlePopupClose = () => {
//     setShowPopup(false);
//     setShowBanner(true);
//   };

//   const handleClick = () => {
//     if (bannerSettings.linkUrl) {
//       window.location.href = bannerSettings.linkUrl;
//     }
//   };

//   return (
//     <>
//       {showPopup && (
//         <PopupOverlay>
//           <PopupContent>
//             <CloseButton onClick={handlePopupClose}>&times;</CloseButton>
//             {bannerSettings.imageUrl && (
//               <PopupImage src={bannerSettings.imageUrl} alt="Promo" />
//             )}
//             <PopupTitle>{bannerSettings.title}</PopupTitle>
//             <PopupMessage>{bannerSettings.message}</PopupMessage>
//             {bannerSettings.linkUrl && (
//               <PopupButton onClick={handleClick}>Learn More</PopupButton>
//             )}
//           </PopupContent>
//         </PopupOverlay>
//       )}
//       {showBanner && !showPopup && (
//         <BannerContainer onClick={() => setShowPopup(true)}>
//           {bannerSettings.imageUrl && (
//             <BannerImage src={bannerSettings.imageUrl} alt="Promo" />
//           )}
//           {bannerSettings.message}
//         </BannerContainer>
//       )}
//     </>
//   );
// };

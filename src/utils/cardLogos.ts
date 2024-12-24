export const getCardLogo = (cardType: string) => {
  const logos = {
    visa: 'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/visa.svg',
    mastercard:
      'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/mastercard.svg',
    amex: 'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/amex.svg',
    discover:
      'https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/discover.svg',
    // Add more card types as needed
  };
  return logos[cardType.toLowerCase()] || '';
};

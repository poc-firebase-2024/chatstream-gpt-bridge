import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 GPT. {t('allRightsReserved')}</p>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement login logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('login')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={() => handleLogin('Apple')} className="w-full">{t('loginWithApple')}</Button>
          <Button onClick={() => handleLogin('Facebook')} className="w-full">{t('loginWithFacebook')}</Button>
          <Button onClick={() => handleLogin('GitHub')} className="w-full">{t('loginWithGitHub')}</Button>
          <Button onClick={() => handleLogin('Google')} className="w-full">{t('loginWithGoogle')}</Button>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button onClick={() => handleLogin('Email')} className="w-full">{t('loginWithEmail')}</Button>
          <div className="text-center space-y-2">
            <a href="#" className="text-blue-500 hover:underline">{t('forgotPassword')}</a>
            <p>{t('dontHaveAccount')} <a href="#" className="text-blue-500 hover:underline">{t('signUp')}</a></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
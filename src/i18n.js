import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          chat: 'Chat',
          login: 'Login',
          loginWithApple: 'Login with Apple',
          loginWithFacebook: 'Login with Facebook',
          loginWithGitHub: 'Login with GitHub',
          loginWithGoogle: 'Login with Google',
          loginWithEmail: 'Login with Email',
          email: 'Email',
          password: 'Password',
          forgotPassword: 'Forgot Password?',
          dontHaveAccount: "Don't have an account?",
          signUp: 'Sign Up',
          enterPrompt: 'Enter your prompt here...',
          send: 'Send',
          processing: 'Processing...',
          response: 'Response',
          allRightsReserved: 'All rights reserved.',
        },
      },
      pt: {
        translation: {
          chat: 'Chat',
          login: 'Entrar',
          loginWithApple: 'Entrar com Apple',
          loginWithFacebook: 'Entrar com Facebook',
          loginWithGitHub: 'Entrar com GitHub',
          loginWithGoogle: 'Entrar com Google',
          loginWithEmail: 'Entrar com Email',
          email: 'Email',
          password: 'Senha',
          forgotPassword: 'Esqueceu a senha?',
          dontHaveAccount: 'Não tem uma conta?',
          signUp: 'Cadastre-se',
          enterPrompt: 'Digite seu prompt aqui...',
          send: 'Enviar',
          processing: 'Processando...',
          response: 'Resposta',
          allRightsReserved: 'Todos os direitos reservados.',
        },
      },
    },
    lng: 'pt', // Set the default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
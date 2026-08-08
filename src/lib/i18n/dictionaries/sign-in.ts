import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface SignInDictionary {
  title: string;
  subtitle: string;
  continueWithGoogle: string;
  signingIn: string;
  or: string;
  resetSuccess: string;
  fillAllFields: string;
  invalidCredentials: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  forgotPassword: string;
  signInButton: string;
  noAccount: string;
  signUpLink: string;
}

export const signInDictionary: Record<LocaleCode, SignInDictionary> = {
  en: {
    title: "Welcome back",
    subtitle: "Sign in to access your meeting insights.",
    continueWithGoogle: "Continue with Google",
    signingIn: "Signing in...",
    or: "OR",
    resetSuccess: "Password updated. Sign in with your new password.",
    fillAllFields: "Please fill in all fields.",
    invalidCredentials: "Invalid email or password.",
    emailLabel: "Email address",
    emailPlaceholder: "name@company.com",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    signInButton: "Sign In",
    noAccount: "Don't have an account?",
    signUpLink: "Sign up",
  },
  fr: {
    title: "Content de vous revoir",
    subtitle: "Connectez-vous pour accéder à vos réunions.",
    continueWithGoogle: "Continuer avec Google",
    signingIn: "Connexion...",
    or: "OU",
    resetSuccess: "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
    fillAllFields: "Merci de remplir tous les champs.",
    invalidCredentials: "Email ou mot de passe invalide.",
    emailLabel: "Adresse email",
    emailPlaceholder: "prenom@entreprise.com",
    passwordLabel: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    signInButton: "Se connecter",
    noAccount: "Pas encore de compte ?",
    signUpLink: "S'inscrire",
  },
};

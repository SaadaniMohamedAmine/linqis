import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ForgotPasswordDictionary {
  title: string;
  subtitle: string;
  submitted: string;
  emailLabel: string;
  emailPlaceholder: string;
  sending: string;
  sendButton: string;
  rememberedPassword: string;
  signInLink: string;
}

export const forgotPasswordDictionary: Record<LocaleCode, ForgotPasswordDictionary> = {
  en: {
    title: "Reset your password",
    subtitle: "Enter the email address on your account and we'll send you a link to reset your password.",
    submitted: "If that email exists, we've sent a reset link. Check your inbox.",
    emailLabel: "Email address",
    emailPlaceholder: "name@company.com",
    sending: "Sending...",
    sendButton: "Send reset link",
    rememberedPassword: "Remembered your password?",
    signInLink: "Sign in",
  },
  fr: {
    title: "Réinitialisez votre mot de passe",
    subtitle: "Entrez l'adresse email de votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    submitted: "Si cet email existe, un lien de réinitialisation vient d'être envoyé. Vérifiez votre boîte de réception.",
    emailLabel: "Adresse email",
    emailPlaceholder: "prenom@entreprise.com",
    sending: "Envoi...",
    sendButton: "Envoyer le lien",
    rememberedPassword: "Vous vous souvenez de votre mot de passe ?",
    signInLink: "Se connecter",
  },
};

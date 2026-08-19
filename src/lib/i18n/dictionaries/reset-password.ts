import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface ResetPasswordDictionary {
  title: string;
  subtitle: string;
  noTokenPrefix: string;
  forgotPasswordLink: string;
  noTokenSuffix: string;
  invalidOrExpired: string;
  passwordTooShort: string;
  passwordsDontMatch: string;
  newPasswordLabel: string;
  passwordHint: string;
  confirmPasswordLabel: string;
  updating: string;
  updateButton: string;
  rememberedPassword: string;
  signInLink: string;
  showPassword: string;
  hidePassword: string;
}

export const resetPasswordDictionary: Record<LocaleCode, ResetPasswordDictionary> = {
  en: {
    title: "Choose a new password",
    subtitle: "Make it something you haven't used before.",
    noTokenPrefix: "This reset link is invalid or has expired. Request a new one from the",
    forgotPasswordLink: "forgot password",
    noTokenSuffix: " page.",
    invalidOrExpired: "This reset link is invalid or has expired.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordsDontMatch: "Passwords don't match.",
    newPasswordLabel: "New password",
    passwordHint: "At least 8 characters",
    confirmPasswordLabel: "Confirm new password",
    updating: "Updating...",
    updateButton: "Update password",
    rememberedPassword: "Remembered your password?",
    signInLink: "Sign in",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  fr: {
    title: "Choisissez un nouveau mot de passe",
    subtitle: "Optez pour un mot de passe que vous n'avez encore jamais utilisé.",
    noTokenPrefix: "Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau depuis la page",
    forgotPasswordLink: "mot de passe oublié",
    noTokenSuffix: ".",
    invalidOrExpired: "Ce lien de réinitialisation est invalide ou a expiré.",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
    passwordsDontMatch: "Les mots de passe ne correspondent pas.",
    newPasswordLabel: "Nouveau mot de passe",
    passwordHint: "8 caractères minimum",
    confirmPasswordLabel: "Confirmer le nouveau mot de passe",
    updating: "Mise à jour...",
    updateButton: "Mettre à jour le mot de passe",
    rememberedPassword: "Vous vous souvenez de votre mot de passe ?",
    signInLink: "Se connecter",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
  },
};

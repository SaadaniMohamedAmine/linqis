import type { LocaleCode } from "@/lib/i18n/locale-context";

export interface SignUpDictionary {
  title: string;
  subtitle: string;
  continueWithGoogle: string;
  creatingAccount: string;
  orContinueWithEmail: string;
  fillAllFields: string;
  passwordTooShort: string;
  couldNotCreate: string;
  createdButSignInFailed: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordHint: string;
  createAccountButton: string;
  alreadyHaveAccount: string;
  signInLink: string;
  agreementPrefix: string;
  termsLink: string;
  and: string;
  privacyLink: string;
  enterpriseSecurity: string;
  aiReady: string;
}

export const signUpDictionary: Record<LocaleCode, SignUpDictionary> = {
  en: {
    title: "Create your account",
    subtitle: "Elevate your meetings with AI intelligence.",
    continueWithGoogle: "Continue with Google",
    creatingAccount: "Creating account...",
    orContinueWithEmail: "or continue with email",
    fillAllFields: "Please fill in all fields.",
    passwordTooShort: "Password must be at least 8 characters.",
    couldNotCreate: "Could not create account.",
    createdButSignInFailed: "Account created, but sign-in failed. Please sign in manually.",
    nameLabel: "Full name",
    namePlaceholder: "John Doe",
    emailLabel: "Email address",
    emailPlaceholder: "name@company.com",
    passwordLabel: "Password",
    passwordHint: "At least 8 characters",
    createAccountButton: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign in",
    agreementPrefix: "By clicking Create Account, you agree to our",
    termsLink: "Terms of Service",
    and: "and",
    privacyLink: "Privacy Policy",
    enterpriseSecurity: "Enterprise Security",
    aiReady: "AI Ready",
  },
  fr: {
    title: "Créez votre compte",
    subtitle: "Passez vos réunions au niveau supérieur grâce à l'IA.",
    continueWithGoogle: "Continuer avec Google",
    creatingAccount: "Création du compte...",
    orContinueWithEmail: "ou continuer avec un email",
    fillAllFields: "Merci de remplir tous les champs.",
    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères.",
    couldNotCreate: "Impossible de créer le compte.",
    createdButSignInFailed: "Compte créé, mais la connexion a échoué. Merci de vous connecter manuellement.",
    nameLabel: "Nom complet",
    namePlaceholder: "Jean Dupont",
    emailLabel: "Adresse email",
    emailPlaceholder: "prenom@entreprise.com",
    passwordLabel: "Mot de passe",
    passwordHint: "8 caractères minimum",
    createAccountButton: "Créer le compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signInLink: "Se connecter",
    agreementPrefix: "En cliquant sur Créer le compte, vous acceptez nos",
    termsLink: "Conditions d'utilisation",
    and: "et notre",
    privacyLink: "Politique de confidentialité",
    enterpriseSecurity: "Sécurité entreprise",
    aiReady: "Prêt pour l'IA",
  },
};

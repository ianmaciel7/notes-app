export const supportedLocales = ["en", "pt-BR"] as const;

export type Locale = (typeof supportedLocales)[number];

export function hasLocale(locale: string | undefined): locale is Locale {
  return (
    typeof locale === "string" &&
    (supportedLocales as readonly string[]).includes(locale)
  );
}

export interface AppMessages {
  common: {
    loading: string;
    close: string;
    more: string;
    breadcrumbLabel: string;
    paginationLabel: string;
    goToPreviousPage: string;
    goToNextPage: string;
    morePages: string;
    carouselRoleDescription: string;
    slideRoleDescription: string;
    previousSlide: string;
    nextSlide: string;
    scrollToEnd: string;
    scrollToStart: string;
    toggleSidebar: string;
    closeToast: string;
    continueWithGoogle: string;
    continueWithGithub: string;
    orContinueWith: string;
    signOut: string;
  };
  home: {
    metadataTitle: string;
    metadataDescription: string;
    logoAlt: string;
    heading: string;
    description: string;
    templates: string;
    learning: string;
    deployNow: string;
    documentation: string;
    vercelLogomarkAlt: string;
  };
  questionnaire: {
    emptyTitle: string;
    emptyDescription: string;
    previous: string;
    skip: string;
    next: string;
    submit: string;
  };
  errors: {
    generic: {
      unexpected: string;
      network: string;
      requiredField: string;
    };
    auth: {
      invalidCredentials: string;
      emailAlreadyInUse: string;
      accountDisabled: string;
      tooManyRequests: string;
      operationNotAllowed: string;
      requiresRecentLogin: string;
      sessionExpired: string;
      unknown: string;
      popupClosedByUser: string;
      popupBlocked: string;
      userNotFound: string;
      wrongPassword: string;
      weakPassword: string;
      invalidEmail: string;
      accountExistsWithDifferentCredential: string;
      unauthorizedDomain: string;
    };
  };
}

type NestedMessageKey<T> = T extends string
  ? never
  : {
      [Key in keyof T & string]: T[Key] extends string
        ? Key
        : `${Key}.${NestedMessageKey<T[Key]>}`;
    }[keyof T & string];

export type MessageKey = NestedMessageKey<AppMessages>;

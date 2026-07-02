export const IUBENDA_SITE_ID = 4592982
export const IUBENDA_COOKIE_POLICY_ID = 73659570

export const IUBENDA_CS_CONFIGURATION = {
  siteId: IUBENDA_SITE_ID,
  cookiePolicyId: IUBENDA_COOKIE_POLICY_ID,
  lang: "en",
  storage: { useSiteId: true },
  perPurposeConsent: true,
  consentOnContinuedBrowsing: false,
  floatingPreferencesButtonDisplay: "bottom-right",
  acceptButtonDisplay: true,
  rejectButtonDisplay: true,
  closeButtonDisplay: false,
  enableTcf: true,
  googleAdditionalConsentMode: true,
} as const

export const IUBENDA_CS_CONFIG_SCRIPT = `var _iub = _iub || []; _iub.csConfiguration = ${JSON.stringify(IUBENDA_CS_CONFIGURATION)};`

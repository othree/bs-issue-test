export const env = "dev";
export const remote = true;
export const API_ENDPOINT = "https://api.smartpay.re";

export const WEB_URL = "https://checkout.smartpay.re";

export const PRIVATE_KEY =
  env === "prod"
    ? "sk_test_TqwDuHwZr0cb59YMCEqXON"
    : "sk_test_a7SlBkzf44tzdQoTwm6FrW";

export const FEATURES = {
  isLoginViaAppFeatureEnabled: true,
  isBankDirectFeatureEnabled: true,
  isPreferAppPromptFeatureEnabled: env === "dev",
};

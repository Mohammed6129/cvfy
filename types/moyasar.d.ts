type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
};

type MoyasarApplePayConfig = {
  country: string;
  label: string;
  validate_merchant_url: string;
  version?: number;
};

type MoyasarGooglePayConfig = {
  country: string;
  label: string;
  merchant_id: string;
  gateway_merchant_id?: string;
  environment?: "TEST" | "PRODUCTION";
  auth_methods?: string[];
};

type MoyasarPaymentOptions = {
  country: string;
  label: string;
};

type MoyasarInitConfig = {
  element: string | HTMLElement;
  amount: number;
  currency: string;
  description: string;
  publishable_api_key: string;
  callback_url: string;
  methods?: string[];
  supported_networks?: string[];
  language?: string;
  fixed_width?: boolean;
  country?: string;
  payment_options?: MoyasarPaymentOptions;
  apple_pay?: MoyasarApplePayConfig;
  google_pay?: MoyasarGooglePayConfig;
  on_completed?: (payment: MoyasarPayment) => Promise<void> | void;
  on_failure?: (error: string) => Promise<void> | void;
  on_redirect?: (url: string) => Promise<void> | void;
};

interface MoyasarGlobal {
  init: (config: MoyasarInitConfig) => void;
  setAmount: (amount: number) => void;
}

interface Window {
  Moyasar?: MoyasarGlobal;
}

type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
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
  on_completed?: (payment: MoyasarPayment) => Promise<void> | void;
  on_failure?: (error: string) => Promise<void> | void;
  on_redirect?: (url: string) => Promise<void> | void;
};

interface MoyasarGlobal {
  init: (config: MoyasarInitConfig) => void;
}

interface Window {
  Moyasar?: MoyasarGlobal;
}

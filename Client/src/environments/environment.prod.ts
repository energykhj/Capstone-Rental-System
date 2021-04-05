import { CurrencyMaskInputMode } from 'ngx-currency';

export const environment = {
  production: true,
  // Azure API Server
  apiUrl: 'https://phoenixrentalserviceapi.azurewebsites.net/api',
  PhotoUrl: 'https://phoenixrentalserviceapi.azurewebsites.net/',
  PhotoUrlAvatar: 'https://phoenixrentalserviceapi.azurewebsites.net/api/UserDetails/GetAvatar/',
  PhotoFileUrl: 'https://phoenixrentalserviceapi.azurewebsites.net/api/Lookup/GetPhoto/',
  allowedDomains: ['phoenixrentalserviceapi.azurewebsites.net'],
  disallowedRoutes: ['phoenixrentalserviceapi.azurewebsites.net/api/Authentication/'],
};

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: 'CA$ ',
  suffix: '',
  thousands: ',',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { CurrencyMaskInputMode } from 'ngx-currency';

export const environment = {
  production: false,
  // Local API Server
  // apiUrl: 'http://localhost:57183/api',
  // PhotoUrl: 'http://localhost:57183/',
  // PhotoUrlAvatar: 'http://localhost:57183/api/UserDetails/GetAvatar/',
  // PhotoFileUrl: 'http://localhost:57183/api/Lookup/GetPhoto/',
  // allowedDomains: ['localhost:57183'],
  // disallowedRoutes: ['localhost:57183/api/Authentication/'],
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
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

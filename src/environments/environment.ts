// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// var base_url = "https://icumed.eazysaas.com/alarm";
var base_url = "http://localhost:8083";
export const environment = {
  production: false,
  base_url,
  alarm_base_url: `${base_url}/admincore/api/v1`,
  // notification_manager_base_url: `${base_url}/notificationservice`,
  // asset_base_url: "http://localhost:4200/assets"  /* for hosting ui seperately */
  asset_base_url: `${base_url}/assets` /* for hosting ui inside node server */,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error  stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

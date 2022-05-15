// export const environment = {
//   production: true,
//   API_URL: "http://3.6.80.67:3010",
//   base_url: "https://3.6.80.67:3000"
// };
var base_url = "https://icumed.eazysaas.com/admincorev3";
export const environment = {
  production: true,
  base_url,
  alarm_base_url: `${base_url}/admincore/api/v1`,
  // notification_manager_base_url: `${base_url}/notificationservice`,
  // asset_base_url: "http://localhost:4200/assets"  /* for hosting ui seperately */
  asset_base_url: `${base_url}/assets` /* for hosting ui inside node server */,
};

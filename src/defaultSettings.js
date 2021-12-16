/**
 * Item Default configuration item
 * primaryColor - Default theme color
 * navTheme - sidebar theme ['dark', 'light'] Two themes
 * colorWeak - color blind mode
 * layout - Overall layout mode [' Sidemenu ', 'TopMenu '] two layouts
 * fixedHeader - Fixed Header : boolean
 * fixSiderbar - Fixed the left menu bar ： boolean
 * autoHideHeader - Hide the Header while scrolling down : boolean
 * contentWidth - Content area layout: streaming | fixed
 *
 * storageOptions: {} - Vue-ls Plug-in configuration item (localStorage/sessionStorage)
 *
 */

export default {
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'light', // theme for nav menu
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  autoHideHeader: false, //  auto hide header
  colorWeak: false,
  multipage: true, //Default multi-tab mode
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
  }
}
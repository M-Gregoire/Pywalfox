import { DEFAULT_COLORSCHEME } from './config';

/**
 * Implements an interface for the pywal colors fetched from the users computer by the native messaging host.
 *
 * @remarks
 * The colors that the native app sends out is just a list of colors, where
 * indexes 0-15 corresponds to the colors generated by pywal and 16-17 the
 * additional colors generated by the native app. All the colors are in the hex format.
 */
export interface IPywalColors  {
  [index: number]: string;
}

export interface IExtensionTheme {
  background: string;
  foreground: string;
  backgroundLight: string;
  accentPrimary: string;
  accentSecondary: string;
  text: string;
}

/**
 * Implements the interface for a browser theme.
 *
 * @remarks
 * The structure of this interface is based on the Firefox Theming API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/theme
 */
export interface IBrowserTheme {
  icons: string;
  icons_attention: string;
  frame: string;
  tab_text: string;
  tab_loading: string;
  tab_background_text: string;
  tab_selected: string;
  tab_line: string;
  tab_background_separator: string;
  toolbar: string;
  toolbar_field: string;
  toolbar_field_focus: string;
  toolbar_field_text: string;
  toolbar_field_text_focus: string;
  toolbar_field_border: string;
  toolbar_field_border_focus: string;
  toolbar_field_separator: string;
  toolbar_field_highlight: string;
  toolbar_field_highlight_text: string;
  toolbar_bottom_separator: string;
  toolbar_top_separator: string;
  toolbar_vertical_separator: string;
  ntp_background: string;
  ntp_text: string;
  popup: string;
  popup_border: string;
  popup_text: string;
  popup_highlight: string;
  popup_highlight_text: string;
  sidebar: string;
  sidebar_border: string;
  sidebar_text: string;
  sidebar_highlight: string;
  sidebar_highlight_text: string;
  bookmark_text: string;
  button_background_hover: string;
  button_background_active: string;
}

export type IDuckDuckGoTheme = IDuckDuckGoThemeColor[];
export interface IDuckDuckGoThemeColor {
  id: string;
  value: string;
}

export type IColorscheme = IBrowserTheme & IExtensionTheme;
export interface IColorschemeTemplate {
  // TODO: Implement the real template interface
  [key: string]: number;
}


export function generateExtensionTheme(colorscheme: IColorscheme) {
  const isColorscheme = colorscheme === null ? false : true;
  return {
    background: isColorscheme ? colorscheme.background : DEFAULT_COLORSCHEME.background,
    backgroundLight: isColorscheme ? colorscheme.backgroundLight : DEFAULT_COLORSCHEME.backgroundLight,
    foreground: isColorscheme ? colorscheme.foreground : DEFAULT_COLORSCHEME.foreground,
    accentPrimary: isColorscheme ? colorscheme.accentPrimary : DEFAULT_COLORSCHEME.accentPrimary,
    accentSecondary: isColorscheme ? colorscheme.accentSecondary : DEFAULT_COLORSCHEME.accentSecondary,
    text: isColorscheme ? colorscheme.text : DEFAULT_COLORSCHEME.text,
  };
}


/**
 * Generates the browser theme.
 *
 * @returns {IBrowserTheme};
 */
export function generateBrowserTheme(colorscheme: IColorscheme) {
  return {
    icons: colorscheme.icons,
    icons_attention: colorscheme.icons_attention,
    frame: colorscheme.frame,
    tab_text: colorscheme.tab_text,
    tab_loading: colorscheme.tab_loading,
    tab_background_text: colorscheme.tab_background_text,
    tab_selected: colorscheme.tab_selected,
    tab_line: colorscheme.tab_line,
    tab_background_separator: colorscheme.tab_background_separator,
    toolbar: colorscheme.toolbar,
    toolbar_field: colorscheme.toolbar_field,
    toolbar_field_focus: colorscheme.toolbar_field_focus,
    toolbar_field_text: colorscheme.toolbar_field_text,
    toolbar_field_text_focus: colorscheme.toolbar_field_text_focus,
    toolbar_field_border: colorscheme.toolbar_field_border,
    toolbar_field_border_focus: colorscheme.toolbar_field_border_focus,
    toolbar_field_separator: colorscheme.toolbar_field_separator,
    toolbar_field_highlight: colorscheme.toolbar_field_highlight,
    toolbar_field_highlight_text: colorscheme.toolbar_field_highlight_text,
    toolbar_bottom_separator: colorscheme.toolbar_bottom_separator,
    toolbar_top_separator: colorscheme.toolbar_top_separator,
    toolbar_vertical_separator: colorscheme.toolbar_vertical_separator,
    ntp_background: colorscheme.ntp_background,
    ntp_text: colorscheme.ntp_text,
    popup: colorscheme.popup,
    popup_border: colorscheme.popup_border,
    popup_text: colorscheme.popup_text,
    popup_highlight: colorscheme.popup_highlight,
    popup_highlight_text: colorscheme.popup_highlight_text,
    sidebar: colorscheme.sidebar,
    sidebar_border: colorscheme.sidebar_border,
    sidebar_text: colorscheme.sidebar_text,
    sidebar_highlight: colorscheme.sidebar_highlight,
    sidebar_highlight_text: colorscheme.sidebar_highlight_text,
    bookmark_text: colorscheme.bookmark_text,
    button_background_hover: colorscheme.button_background_hover,
    button_background_active: colorscheme.button_background_active,
  };
}

/**
 * Generates the DuckDuckGo theme.
 *
 * @returns {IDuckDuckGoThemeColor[]} The cookies used to set the DuckDuckGo theme
 */
export function generateDDGTheme(colorscheme: IColorscheme) {
  return [
    { id: '7',  value: colorscheme.background },        // Background
    { id: 'j',  value: colorscheme.background },        // Header background
    { id: '9',  value: colorscheme.text },              // Result link title
    { id: 'aa', value: colorscheme.accentPrimary },     // Result visited link title
    { id: 'x',  value: colorscheme.accentSecondary },   // Result link url
    { id: '8',  value: 'f8f8f8' },                      // Result description
    { id: '21', value: colorscheme.backgroundLight },   // Result hover, dropdown, etc.
    { id: 'ae', value: 'pywalfox' },                    // The theme name
  ];
}




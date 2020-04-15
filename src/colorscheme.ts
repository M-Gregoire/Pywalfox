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

export interface IColorscheme {
  background: string;
  foreground: string;
  backgroundLight: string;
  accentPrimary: string;
  accentSecondary: string;
  text: string;
}

/**
 * Implements functions for parsing pywal colors received from the native app and
 * generating a this.colorscheme.and an extension- and browser theme.
 *
 * @param pywalColors - the pywal colors received from the native messaging host
 */
export class Colorscheme {
  private pywalColors: IPywalColors;

  private colorscheme: IColorscheme;
  private browserTheme: IBrowserTheme;

  constructor(pywalColors: IPywalColors) {
    this.pywalColors = pywalColors;

    this.generateColorscheme();
    this.generateBrowserTheme();
  }

  private getColor(colorKey: string) {
    // TODO: Get color from colorscheme template
    return "#ffffff";
  }

  private generateColorscheme() {
    this.colorscheme = {
      background: this.getColor('background'),
      backgroundLight: this.getColor('backgroundLight'),
      foreground: this.getColor('foreground'),
      accentPrimary: this.getColor('accentPrimary'),
      accentSecondary: this.getColor('accentSecondary'),
      text: this.getColor('text'),
    };
  }

  private generateBrowserTheme() {
    this.browserTheme = {
      icons: this.colorscheme.accentPrimary,
      icons_attention: this.colorscheme.accentSecondary,
      frame: this.colorscheme.background,
      tab_text: this.colorscheme.background,
      tab_loading: this.colorscheme.accentPrimary,
      tab_background_text: this.colorscheme.text,
      tab_selected: this.colorscheme.foreground,
      tab_line: this.colorscheme.foreground,
      tab_background_separator: this.colorscheme.background,
      toolbar: this.colorscheme.background,
      toolbar_field: this.colorscheme.background,
      toolbar_field_focus: this.colorscheme.background,
      toolbar_field_text: this.colorscheme.text,
      toolbar_field_text_focus: this.colorscheme.text,
      toolbar_field_border: this.colorscheme.background,
      toolbar_field_border_focus: this.colorscheme.background,
      toolbar_field_separator: this.colorscheme.background,
      toolbar_field_highlight: this.colorscheme.accentPrimary,
      toolbar_field_highlight_text: this.colorscheme.text,
      toolbar_bottom_separator: this.colorscheme.background,
      toolbar_top_separator: this.colorscheme.background,
      toolbar_vertical_separator: this.colorscheme.backgroundLight,
      ntp_background: this.colorscheme.background,
      ntp_text: this.colorscheme.foreground,
      popup: this.colorscheme.background,
      popup_border: this.colorscheme.backgroundLight,
      popup_text: this.colorscheme.foreground,
      popup_highlight: this.colorscheme.accentSecondary,
      popup_highlight_text: this.colorscheme.text,
      sidebar: this.colorscheme.background,
      sidebar_border: this.colorscheme.backgroundLight,
      sidebar_text: this.colorscheme.foreground,
      sidebar_highlight: this.colorscheme.accentPrimary,
      sidebar_highlight_text: this.colorscheme.text,
      bookmark_text: this.colorscheme.text,
      button_background_hover: this.colorscheme.backgroundLight,
      button_background_active: this.colorscheme.backgroundLight,
    };
  }
}


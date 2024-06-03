declare module "@mui/material/styles" {
  interface CustomTheme extends Theme {}
  interface CustomThemeOptions extends ThemeOptions {}
  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

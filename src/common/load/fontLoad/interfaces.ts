export interface WebFontOptions {
  google?: WebFontSource;
  custom?: WebFontSource;
}

export interface WebFontSource {
  families?: string[]; // ['Droid Sans', 'Droid Serif:bold']
  urls?: string[]; // ['/fonts.css']
}

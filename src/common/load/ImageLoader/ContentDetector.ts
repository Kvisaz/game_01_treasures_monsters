export namespace ContentDetector {
  export function isSvg(contentType: string | null): boolean {
    return ContentDetector.isContent(contentType, 'image/svg+xml');
  }

  export function isPng(contentType: string | null): boolean {
    return ContentDetector.isContent(contentType, 'image/png');
  }

  export function isJpeg(contentType: string | null): boolean {
    return ContentDetector.isContent(contentType, 'image/jpeg');
  }

  export function isContent(contentType: string | null, typeMarker: string) {
    if (contentType == null) return false;
    return contentType.indexOf(typeMarker) > -1;
  }
}

const GALLERY_UPLOAD_PATH = "/settings/post/artwork";

export function galleryUploadHref(isLoggedIn: boolean): string {
  return isLoggedIn
    ? GALLERY_UPLOAD_PATH
    : `/auth/login?redirect_to=${encodeURIComponent(GALLERY_UPLOAD_PATH)}`;
}

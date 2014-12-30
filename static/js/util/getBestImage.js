/**
 * We always try to pick the closest larger image. For example:
 * img1: 150px, img2: 80px, desired: 100px
 * In this case, we pick img1 not img2.
 */
function pickBest(desiredWidth, img1, img2) {
  if (!img1) return img2;
  if (!img2) return img1;

  if (img1.width < desiredWidth) {
    return img1.width > img2.width ? img1 : img2;
  }
  // now we know: (img1.width > desiredWidth)
  if (img2.width < desiredWidth) {
    return img1;
  }
  return img1.width < img2.width ? img1 : img2;
}

/**
 * Takes a list of images and a desired width; returns the best image.
 * Images:
 * [
 *   {url, width, height},
 *   {url, width, height},
 *   ...
 * ]
 */
module.exports = window.best = function(images, desiredWidth) {
  return images.reduce(
    pickBest.bind(null, desiredWidth)
  );
};

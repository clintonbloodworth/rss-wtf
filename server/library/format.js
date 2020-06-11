const { highlightAuto } = require("highlight.js");
const { JSDOM } = require("jsdom");
const srcset = require("srcset");
const buildAbsoluteUrl = require("./build-absolute-url");

module.exports = (html, title, baseUrl) => {
  const { document } = new JSDOM(html).window;

  // It would be nice to let the minifier take care of this.
  // But there's no option to exclude SVGs or their children.
  document
    .querySelectorAll("*")
    .forEach(element => {
      const isRemovableIfEmpty = element.tagName !== "audio"
        && element.tagName !== "BR"
        && element.tagName !== "IFRAME"
        && element.tagName !== "IMG"
        && element.tagName !== "SOURCE"
        && element.tagName !== "TD"
        && element.tagName !== "TH"
        && element.tagName !== "TRACK"
        && element.tagName !== "VIDEO"
        && !element.querySelector("audio")
        && !element.querySelector("img")
        && !element.querySelector("iframe")
        && !element.querySelector("source")
        && !element.querySelector("track")
        && !element.querySelector("video")
        && !element.closest("svg");

      if (isRemovableIfEmpty && !element.textContent) {
        element.parentNode.removeChild(element);
      }
    });

  document
    .querySelectorAll("a")
    .forEach(element => {
      if (baseUrl && element.href) {
        element.href = buildAbsoluteUrl(element.href, baseUrl);
      }
    });

  // Valid `noopener` tags:
  // https://html.spec.whatwg.org/multipage/links.html#link-type-noopener
  document
    .querySelectorAll("a, area, form")
    .forEach(element => {
      element.rel = "noopener noreferrer";
    });

  document
    .querySelectorAll("article")
    .forEach(article => {
      // We'll be wrapping this entire thing in an article
      // later on. So nested articles don't make sense.
      article.outerHTML = article.innerHTML;
    });

  document
    .querySelectorAll("audio, video")
    .forEach(element => {
      element.controls = "controls";
      element.preload = "none";
    });

  document
    .querySelectorAll("pre")
    .forEach(pre => {
      try {
        const { value } = highlightAuto(pre.textContent);
        pre.innerHTML = value;
      } catch {}
    });

  document
    .querySelectorAll("img")
    .forEach(img => {
      if (img.closest("picture")) {
        return;
      }

      // The client uses PICTURE as a container for full-width images.
      const picture = document.createElement("picture");
      picture.innerHTML = img.outerHTML;
      img.outerHTML = picture.outerHTML;
    });

  document
    .querySelectorAll("img[src^=\"http:\"]")
    .forEach(element => {
      element.src = `${process.env.SELF_URL}/image?url=${encodeURIComponent(element.src)}`;
    });

  document
    .querySelectorAll("video[poster]:not([poster=\"\"])")
    .forEach(element => {
      if (!element.poster) {
        return;
      }

      element.poster = buildAbsoluteUrl(element.src, baseUrl);
    });

  document
    .querySelectorAll("track[default]")
    .forEach(track => {
      track.default = "default";
    });

  document
    .querySelectorAll("p > b:first-child, p > strong:first-child") // Drop caps hacks.
    .forEach(element => {
      element.outerHTML = element.textContent;
    });

  document
    .querySelectorAll("picture")
    .forEach(() => {
      // Can't rely on art direction from the host without styling
      // the article using the host's styles.

      document
        .querySelectorAll("source")
        .forEach(source => {
          source.parentNode.removeChild(source);
        });
    });

  document
    .querySelectorAll("[src], [srcset]")
    .forEach(element => {
      let srcset$;

      if (element.srcset) {
        try {
          srcset$ = srcset.parse(element.srcset);
        } catch (_) {}
      }

      if (!element.src && (!srcset$ || !srcset$.length)) {
        element.parentNode.removeChild(element);
        return;
      }

      if (srcset$ && srcset$.length) {
        srcset$.forEach(srcset => {
          srcset.url = buildAbsoluteUrl(srcset.url, baseUrl);
        });

        element.srcset = srcset.stringify(srcset$);
      }

      element.src = buildAbsoluteUrl(element.src, baseUrl);
      element.referrerpolicy = "no-referrer";
    });

  const h1s = document.querySelectorAll("h1");

  if (!h1s.length && title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    document.documentElement.prepend(h1);
  }

  const article = document.createElement("article");
  article.innerHTML = document.documentElement.innerHTML;
  return article.outerHTML;
};

const buildAbsoluteUrl = require("./build-absolute-url");
const srcset = require('srcset');
const { highlightAuto } = require('highlight.js');
const { JSDOM } = require("jsdom");

module.exports = (html, title, baseUrl) => {
  const { document } = new JSDOM(html).window;

  document
    .querySelectorAll("a")
    .forEach((element) => {
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
    .forEach(element => {
      // We'll be wrapping this entire thing in an article
      // later on. So nested articles don't make sense.
      element.outerHTML = element.innerHTML;
    });

  document
    .querySelectorAll("audio, video")
    .forEach(element => {
      element.controls = "controls";
      element.preload = "none";
  });

  document
    .querySelectorAll("pre")
    .forEach(element => {
      if (!element.querySelector("code")) {
        return;
      }

      try {
        const { value } = highlightAuto(element.textContent);
        element.innerHTML = value;
      } catch {}
    });

  document
    .querySelectorAll("img")
    .forEach(element => {
      if (element.closest("picture")) {
        return
       }

      // The client uses PICTURE as a container for full-width images.
      const picture = document.createElement("picture");
      picture.innerHTML = element.outerHTML;
      element.outerHTML = picture.outerHTML;
  });

  document
    .querySelectorAll(`img[src^="http:"]`)
    .forEach(element => {
      element.src = `${process.env.SELF_URL}/image?url=${encodeURIComponent(element.src)}`;
    });

  document
    .querySelectorAll(`video[poster]:not([poster=""])`)
    .forEach(element => {
      if (!element.poster) {
        return;
      }

      element.poster = buildAbsoluteUrl(url, baseUrl);
    });

  document
    .querySelectorAll("track[default]")
    .forEach(element => {
      element.default = "default";
    });

  // Drop caps hacks.
  document
    .querySelectorAll("p > b:first-child, p > strong:first-child")
    .forEach(element => {
      element.outerHTML = element.textContent;
    });

  document
    .querySelectorAll("picture")
    .forEach(element => {
      // Can't rely on art direction from the host without
      // styling the article using the host's styles.
      let html = "";

      document
        .querySelectorAll("img")
        .forEach(element => {
          html += element.outerHTML;
        })

      element.innerHTML = html
    });

  // TODO: test feed with relative use srcset
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
        srcset$.forEach((srcset) => {
          srcset.url = buildAbsoluteUrl(srcset.url, baseUrl)
        });

        element.srcset = srcset.stringify(srcset$);
      }

      element.src = buildAbsoluteUrl(element.src, baseUrl);
      element.referrerpolicy = "no-referrer"
    });

  const h1s = document.querySelectorAll("h1");

  if (!h1s.length && title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    document.documentElement.prepend(h1);
  }

  const article = document.createElement("article");
  article.innerHTML = document.documentElement.innerHTML;
  return document.documentElement.innerHTML = article.outerHTML;
}

module.exports = {
  defaultSeverity: "error",
  extends: ["stylelint-config-standard", "stylelint-config-recommended"],
  plugins: ["stylelint-order"],
  rules: {
    "color-hex-length": "long",
    "length-zero-no-unit": null,
    "order/properties-alphabetical-order": true,
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: "global" },
    ],
  },
};

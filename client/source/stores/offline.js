import writable from "library/writable";

export default writable(false, {
  adapter: "ls",
  name: "stores/offline",
});

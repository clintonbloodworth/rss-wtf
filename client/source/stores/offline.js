import { writable } from "library/store";

export default writable(false, {
  adapter: "ls",
  name: "stores/offline",
});

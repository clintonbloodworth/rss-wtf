import { writable } from "library/store";

export default writable(false, {
  name: "stores/loading",
});

const rememberMe = "local";
const sessionLength = 8760; // 1 year.
let isInitialized;
let userbase;

async function initialize() {
  if (isInitialized) {
    return userbase;
  }

  ({ default: userbase } = await import(
    /* webpackPrefetch: true */
    "userbase-js"
  ));

  await userbase.init({
    appId: process.env.USERBASE_APP_ID,
  });

  isInitialized = true;
  return userbase;
}

export default {
  async deleteUser(options) {
    const { deleteUser } = await initialize();
    return deleteUser(options);
  },
  async openDatabase(databaseName, changeHandler) {
    const { openDatabase } = await initialize();
    return openDatabase({ changeHandler, databaseName });
  },
  async putTransaction(options) {
    const { putTransaction } = await initialize();
    return putTransaction(options);
  },
  async signIn(username, password) {
    const { signIn } = await initialize();

    const user = await signIn({
      password,
      rememberMe,
      sessionLength,
      username,
    });

    return user;
  },
  async signOut() {
    const { signOut } = await initialize();
    return signOut();
  },
  async signUp(username, password) {
    const { signUp } = await initialize();

    return signUp({
      password,
      rememberMe,
      sessionLength,
      username,
    });
  },
  async updateUser(options) {
    const { updateUser } = await initialize();
    return updateUser(options);
  },
};

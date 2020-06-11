export default {
  addingToClient: new Set(),
  addingToServer: new Set(),
  removingFromClient: new Set(),
  removingFromServer: new Set(),
  retryDelay: 30000,
  server: new Set(),
  unsubscribe: null,
  username: null,
}

export default ({
  method,
  query,
  timeout,
  url,
} = {}) => {
  const fetch = (options = {}) => {
    const controller = new AbortController();
    options.signal = controller.signal;
    timeout = options.timeout || 15000;

    if (options.timeout) {
      delete options.timeout;
      setTimeout(controller.abort, timeout);
    }

    url = new URL(url, process.env.API_URL);

    if (query || options.query) {
      url.search = new URLSearchParams({
        ...query,
        ...options.query,
      });

      delete options.query;
    }

    const request = window.fetch(url, {
      method,
      ...options,
    }).then(response => {
      if (response.status >= 300) {
        const error = new Error(response.statusText);
        error.name = response.status;
        throw error;
      }

      return response;
    });

    request.abort = controller.abort.bind(controller);
    return request;
  };

  fetch.json = () => {
    return (options = {}) => {
      const request = fetch(options);
      const then = request.then(response => response.json());
      then.abort = request.abort;
      return then;
    };
  };

  return fetch;
};

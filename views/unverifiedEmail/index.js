const { NETLIFY_URL } = process.env;

setTimeout(function () {
  window.location = NETLIFY_URL;
}, 2000);

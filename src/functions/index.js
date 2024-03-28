const functions = require("firebase-functions");
const next = require("next");

// Provide path to your Next app instance and dev flag
const app = next({
  dev: false, // Ensure this is false for production
  conf: { distDir: ".next" }, // Use your Next.js distDir if different
});

const handleRequest = app.getRequestHandler();

exports.nextApp = functions.https.onRequest((request, response) => {
  console.log("File: " + request.originalUrl); // log the page.js file that is being requested
  return app.prepare().then(() => handleRequest(request, response));
});

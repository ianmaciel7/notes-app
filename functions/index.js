const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.health = onRequest((_request, response) => {
  logger.info("Health check endpoint pinged", { structuredData: true });
  response.send("ok");
});


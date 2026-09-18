const { onRequest } = require("firebase-functions/v2/https");

exports.health = onRequest((_request, response) => {
  response.send("ok");
});

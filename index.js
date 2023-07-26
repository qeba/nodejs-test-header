// Import required modules
const express = require('express');
const requestIp = require('request-ip');

// Create an instance of the Express application
const app = express();

// Middleware to get client's IP address from X-Forwarded-For header
app.use(requestIp.mw({ attributeName: 'clientIp' }));

// Middleware to get X-Forwarded-Proto and X-Forwarded-Port headers
app.use((req, res, next) => {
  req.forwardedProto = req.headers['x-forwarded-proto'] || req.protocol;
  req.forwardedPort = req.headers['x-forwarded-port'] || req.connection.localPort;
  next();
});

// Define a route that returns the detailed IP information
app.get('/', (req, res) => {
  const { headers, clientIp, forwardedProto, forwardedPort } = req;
  
  const response = {
    headers: headers,
    clientIp: clientIp,
    forwardedProto: forwardedProto,
    forwardedPort: forwardedPort
  };

  // Set response headers to indicate JSON content
  res.setHeader('Content-Type', 'application/json');

  // Send the JSON response with prettify option
  res.send(JSON.stringify(response, null, 2));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

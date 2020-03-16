/**
 * index.ts
 * Bootstraps the React application.
 */

// Import the dependent modules.
import express from 'express';

// Retrieve the server application using require to support hot module
// replacement and recover from errors.
// tslint:disable-next-line:no-var-requires
let app = require('./server/index').default;

// If hot module replacement is present, trigger reloads from the server.
if (module.hot) {
  module.hot.accept('./server/index', () => {
    console.log('🔁  HMR Reloading `./Server/index`...');
    try {
      app = require('./server/index').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

// Set the server port for the application to 3000.
const port = process.env.PORT || 3000;

// Export the express application, listening on the designated port.
export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    console.log(`> Started on port ${port}`);
  });

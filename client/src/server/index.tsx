/**
 * Server.tsx
 * Creates the express server and manages route requests for the react app.
 */

// Import the dependent modules.
//import { ConnectedRouter } from 'connected-react-router';
import express from 'express';
import { Frontload, frontloadServerRender } from 'react-frontload';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import Serialize from 'serialize-javascript';

// Import the dependent components.
import AppContainer from '../routes/AppContainer';

// Import the dependent models.
import { store } from '../store/Store';

// Define the assets to be loaded from the manifest.
let assets: any;

/**
 * Loads the assets from the environment variables.
 */
const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};

// Synchronize the assets from the environment variables.
syncLoadAssets();

const serverRender = async (url: string, context: any) => {
  const markup: string = await frontloadServerRender(() =>
      renderToString(
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
            <Frontload>
              <AppContainer />
            </Frontload>
          </StaticRouter>
        </Provider>
      )
  );

  return markup;
}

/**
 * Creates an express server.
 */
const server = express()
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get('/*', async (req: express.Request, res: express.Response) => {
    const context = {};

    const markup = await serverRender(req.url, context);
    // Load the application as a static route using the request url and create
    // a string to be returned in the response.
    /*
    frontloadServerRender(() =>
      renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <Frontload>
              <AppContainer />
            </Frontload>
          </StaticRouter>
        </Provider>
      )
    ).then((markup: string) => {
     */
      const storeState: Store = store.getState();

      // Send the html response to the client.
      res.status(200).send(
        `<!doctype html>
         <html lang="">
         <head>
           <meta http-equiv="X-UA-Compatible" content="IE=edge" />
           <meta charSet='utf-8' />
           <title>Ravebox</title>
           <meta name="viewport" content="width=device-width, initial-scale=1">
           <link rel="shortcut icon" href="/favicon.ico">
           ${
             assets.client.css
               ? `<link rel="stylesheet" href="${assets.client.css}">`
               : ''
           }
           ${
             process.env.NODE_ENV === 'production'
               ? `<script src="${assets.client.js}" defer crossorigin></script>`
               : `<script src="${assets.client.js}" defer crossorigin></script>`
           }
         </head>
         <body>
           <div id="root">${markup}</div>
         </body>
         <script>
           window.__PRELOADED_STATE__ = ${Serialize(storeState)}
         </script>
         </html>`
      );

    //});
    
  });

export default server;

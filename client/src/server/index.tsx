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
import App from '../routes/App';

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
  const markup: string = await frontloadServerRender(() => (
    renderToString(
      <Frontload>
        <Provider store={store}>
          <StaticRouter location={url} context={context}>
              <App />
          </StaticRouter>
        </Provider>
      </Frontload>
    )
  ));

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
         <link href="https://fonts.googleapis.com/css2?family=Muli:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
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
         <div id="root" class="loader">${markup}</div>
       </body>
       <script>
         window.__PRELOADED_STATE__ = ${Serialize(storeState)}
       </script>
       </html>`
    );
  });

export default server;

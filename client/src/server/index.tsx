/**
 * Server.tsx
 * Creates the express server and manages route requests for the react app.
 */

// Import the dependent modules.
import {
  ChunkExtractor,
  ChunkExtractorManager
} from '@loadable/server';
import compression from 'compression';
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import {
  Frontload,
  frontloadServerRender
} from 'react-frontload';
import { Helmet } from 'react-helmet';
import {
  html,
  oneLineTrim
} from 'common-tags';
import * as Path from 'path';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Serialize from 'serialize-javascript';
import { StaticRouter } from 'react-router';
import { Store } from 'redux';

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

const serverRender = async (url: string, context: any, extractor: ChunkExtractor) => {
  if (url === '/index.html') {
    url = '/';
  }
  const markup: string = await frontloadServerRender(() => (
    renderToString(
      <ChunkExtractorManager extractor={extractor}>
        <Frontload>
          <Provider store={store}>
            <StaticRouter location={url} context={context}>
                <App />
            </StaticRouter>
          </Provider>
        </Frontload>
      </ChunkExtractorManager>
    )
  ));

  return markup;
}

/**
 * Creates an express server.
 */
const server = express()
  .disable('x-powered-by')
  .use(compression())
  .use(
    expressStaticGzip(process.env.RAZZLE_PUBLIC_DIR!, {
      enableBrotli: true,
      orderPreference: ['br', 'gz']
    })
  )
  .get('/*', async (req: express.Request, res: express.Response) => {
    const extractor = new ChunkExtractor({
      statsFile: Path.resolve('build/loadable-stats.json'),
      entrypoints: ['client'],
    });
    const context = {};
    const markup = await serverRender(req.url, context, extractor);
    const storeState: Store = store.getState();

    const helmet = Helmet.renderStatic();

    // Send the html response to the client.
    res.status(200).send(
      oneLineTrim(
        html`
          <!doctype html>
           <html lang="en" ${helmet.htmlAttributes.toString()}>
           <head>
             <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
             <meta http-equiv="X-UA-Compatible" content="IE=edge" />
             <meta charSet='utf-8' />
             ${helmet.title.toString()}
             <meta name="viewport" content="width=device-width, initial-scale=1">
             <link href="https://fonts.googleapis.com/css2?family=Muli:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" crossorigin>
             <link href="/css/loading.css" rel="stylesheet">
             <link rel="shortcut icon" href="/favicon.ico">
             ${helmet.meta.toString()}
             ${helmet.link.toString()}
             ${extractor.getLinkTags()}
             ${extractor.getStyleTags()}
           </head>
           <body ${helmet.bodyAttributes.toString()}>
             <div id="root" class="loader">${markup}</div>
             ${extractor.getScriptTags()}
           </body>
           <script>
             window.__PRELOADED_STATE__ = ${Serialize(storeState)}
           </script>
           </html>
        `
      )
    );
  });

export default server;

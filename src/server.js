import React from 'react';
import FavIcon from './resources/img/favicon.ico';
import { SheetsRegistry } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

export default class Server {
  apply(serverHandler) {
    serverHandler.hooks.beforeAppRender.tapPromise('AddCSS', async (app, req, res) => {
      const sheetsRegistry = new SheetsRegistry();
  
      // Create a sheetsManager instance.
      const sheetsManager = new Map();
  
      // Create a theme instance.
      const theme = createMuiTheme({
        palette: {
          primary: blue,
          accent: red,
          type: 'light',
        },
        typography: {
          useNextVariants: true,
        },
      });
  
      // Create a new class name generator.
      const generateClassName = createGenerateClassName();
      app.children = (
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
            {app.children}
          </MuiThemeProvider>
        </JssProvider>
      );
      res.locals.sheetsRegistry = sheetsRegistry;
    });
  
    serverHandler.hooks.beforeHtmlRender.tapPromise('AppendCSSText', async (app, req, res) => {
      if (res.locals.sheetsRegistry && res.locals.sheetsRegistry.toString) {
        const css = res.locals.sheetsRegistry.toString();
        app.htmlProps.footer.push(<style key="server-css" id="jss-server-side" dangerouslySetInnerHTML={{ __html: css}} />);
      }
      app.htmlProps.head.push(
        <link key="favicon" rel="shortcut icon" type="image/x-icon" href={FavIcon} />,
        <script key="addGoogleAnalytics" async src="https://www.google-analytics.com/analytics.js" />,
      );
      return app;
    });
    
    
  }
}

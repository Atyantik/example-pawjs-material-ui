import React from 'react';
import { SheetsRegistry } from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
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
          primary: green,
          accent: red,
          type: 'light',
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
        app.htmlProps.footer.push(<style id="jss-server-side" dangerouslySetInnerHTML={{ __html: css}} />);
      }
    });
    
    
  }
}

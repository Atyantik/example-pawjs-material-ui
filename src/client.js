import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
export default class Client {
  
  apply(clientHandler) {
    clientHandler.hooks.beforeRender.tapPromise('RemoveCSS', async (app) => {
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
        <JssProvider generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            {app.children}
          </MuiThemeProvider>
        </JssProvider>
      );
    });
    
    clientHandler.hooks.renderComplete.tap('RemoveCSSElement', () => {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    });
  }
}

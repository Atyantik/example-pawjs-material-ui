import React from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

export default class Client {
  loadAds() {
    setTimeout(() => {
      // eslint-disable-next-line
      if (typeof _codefund !== 'undefined' && _codefund.serve) {
        // eslint-disable-next-line
        _codefund.serve();
      }
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, 10);
  }
  
  trackPageView() {
    const { ga } = window;
    if (typeof ga !== 'undefined' && ga) {
      ga('send', {
        hitType: 'pageview',
        page: window.location.pathname,
      });
    }
  }
  
  apply(clientHandler) {
    clientHandler.hooks.beforeRender.tapPromise('RemoveCSS', async (app) => {
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
        <JssProvider generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            {app.children}
          </MuiThemeProvider>
        </JssProvider>
      );
      this.loadAds();
    });
    
    clientHandler.hooks.renderComplete.tap('RemoveCSSElement', () => {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
      window.ga = window.ga || function () {
        (window.ga.q = window.ga.q || []).push(arguments);
      };
      window.ga.l = +new Date;
      window.ga('create', 'UA-108804791-1', 'auto');
      window.ga('send', 'pageview', window.location.pathname);
    });
    
    clientHandler.hooks.locationChange.tapPromise('ReInitAds', async () => {
      this.loadAds();
      this.trackPageView();
    });
  }
}

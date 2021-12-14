import '../styles/globals.css'
import React from "react";
import Head from "next/head"
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

function MyApp({ Component, pageProps }) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const theme = React.useMemo(
	() =>
	  createTheme({
      palette: {
        primary: {
          main: '#000000',
        },
        secondary: {
          main: '#FFFFFF',
        }
      },
      typography:{
        fontFamily: "'Lato', sans-serif"
      }
    }),
    [prefersDarkMode],
  );
  return ( 
	  	<>
		  	<ThemeProvider theme={theme}>
				<CssBaseline/>
				<Component {...pageProps} appName="CharLando"/>
			</ThemeProvider>
		</>
	)
}

export default MyApp

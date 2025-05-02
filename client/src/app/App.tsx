import * as React from 'react';
import { RootStoreContext } from './root-store-context';
import RootStore from './root-store';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LoginPage } from 'pages/sign-in';
import { NotesPage } from 'pages/notes';
import { Route, Routes } from 'react-router-dom';
import { Header } from 'widgets/header';
import { MainPage } from 'pages/main';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    // primary:
  },
});

export const App = () => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/notes" element={<NotesPage />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </RootStoreContext.Provider>
  );
};

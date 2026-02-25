import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider as ReduxProvider} from 'react-redux'
import store from './app/store.ts';
import { Provider as ChakraProvider } from "./components/ui/provider";
import { Toaster } from "./components/ui/toaster";
import themes from './app/utils/themes.ts';
import {ThemeProvider} from 'styled-components';

createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <ChakraProvider>
      <ThemeProvider theme={themes[0]}>
        <App />
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  </ReduxProvider>,
)

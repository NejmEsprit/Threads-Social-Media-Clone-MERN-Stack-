import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { ColorModeScript, extendTheme } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'

const Styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiyteAlpa.900')(props),
      bg: mode('gary.100', '#101010')(props),
    }
  })
}
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}
const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  }
}
const theme = extendTheme({ config, Styles, colors })
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)

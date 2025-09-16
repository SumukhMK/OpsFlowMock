import React from 'react'
import ReactDOM from 'react-dom/client'
import { Grommet, Box } from 'grommet'
import { hpe as hpeTheme } from 'grommet-theme-hpe'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Grommet full theme={hpeTheme}>
      <Box fill>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Box>
    </Grommet>
  </React.StrictMode>
)

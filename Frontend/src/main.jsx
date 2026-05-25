import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/app.store.js'
import './app/App.css'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)

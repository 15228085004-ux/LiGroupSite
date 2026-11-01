import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SiteContentProvider } from './data/siteContent.jsx'

import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/sections.css'
import './styles/footer.css'
import './styles/responsive.css'
import './styles/news-page.css'
import './styles/motion.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </React.StrictMode>,
)

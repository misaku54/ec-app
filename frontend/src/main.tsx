import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RoutePractice } from './practice/RoutePractice';
// import './index.css'
// import App from './App.tsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(rootElement);

const App = () => {
  return (
    <>
      <h1>aaaa</h1>
    </>
  )
}

root.render(
  // <StrictMode>
  <>
    <RoutePractice />
  </>
  // </StrictMode>
);
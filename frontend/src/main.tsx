import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EventBasic } from './practice/EventBasic';
import { StateBasic } from './practice/StateBasic';
import { Effect } from './practice/Effect';
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
  <StrictMode>
    {/* <App/>
    <EventBasic type="date" />
    <EventBasic type="time" />
    <StateBasic init={0}/> */}
    <Effect/>
  </StrictMode>
);
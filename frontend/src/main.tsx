import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App2 } from './App2'
import { Call } from './Call';
import { App } from './App';


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
const root = createRoot(rootElement);

// const App = () => {
//   return (
//     <>
//       <h1>aaaa</h1>
//     </>
//   )
// }

root.render(
  // <StrictMode>
  <>
    <App2 />
  </>
  // </StrictMode>
);
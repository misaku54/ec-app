import ProductList from './components/ProductList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>ECサイト</h1>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  )
}

export default App

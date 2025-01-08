
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/router'

function App() {


  return (
    <div className="max-w-7xl w-full mx-auto min-h-screen">
      <RouterProvider router={routes}/>
  
    </div>
  )
}

export default App

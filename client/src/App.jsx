import {Routes, Route, Navigate} from "react-router"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from './context/ProtectedRoute'
import AuthorizedPage from "./pages/AuthorizedPage"

const App = () => {
  return (
    <div data-theme="forest">
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/auth" exact element={<AuthPage/>} />
        <Route path="/authorized" exact element={
          <ProtectedRoute>
            <AuthorizedPage />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  );
}

export default App

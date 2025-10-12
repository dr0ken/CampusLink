import { useContext } from "react"
import { NavLink, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { Share2 } from "lucide-react"


export const Navbar = () => {

  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    navigate('/login')
  }

  return (
    <div className="navbar bg-base-100 shadow-xs">
      <div className="flex-1">
        <NavLink to={(auth.isAuthenticated) ? "/vacancies":"/" } className="btn btn-ghost glass text-xl" viewTransition><Share2 />CampusLink</NavLink>
      </div>
      <div className="flex-none">
        <ul className="flex gap-2">
          <li><NavLink to="/profile" className="btn btn-primary">Профиль</NavLink></li>
          <li><button className="btn btn-secondary" onClick={logoutHandler}>Выход</button></li>
        </ul>
      </div>
    </div>
  )
}
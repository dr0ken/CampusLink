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
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost glass text-xl"><Share2 />CampusLink</NavLink>
      </div>
      <div className="flex-none">
        <ul>
          <li className="btn btn-primary mx-2"><NavLink to="/authorized">Authorized</NavLink></li>
          <button className="btn btn-secondary" onClick={logoutHandler}>Logout</button>
        </ul>
      </div>
    </div>
  )
}
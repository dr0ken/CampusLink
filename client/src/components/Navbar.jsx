import { useContext } from "react"
import { NavLink, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"

export const Navbar = () => {

  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    navigate('/auth')
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost text-xl">CampusLink</NavLink>
      </div>
      <div className="flex-none">
        <ul>
          <li className="btn btn-ghost"><NavLink to="/authorized">Authorized</NavLink></li>
          <button className="btn btn-ghost" onClick={logoutHandler}>Logout</button>
        </ul>
      </div>
    </div>
  )
}
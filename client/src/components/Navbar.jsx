import { useContext } from "react"
import { NavLink, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { Share2 } from "lucide-react"
import { useGetProfile } from "../hooks/useGetProfile"
import { Avatar } from "./Avatar"


export const Navbar = () => {

  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    navigate('/login')
  }

  const {isSuccess, data} = useGetProfile()

  return (
    <div className="navbar bg-base-100 shadow-xs">
      <div className="flex-1">
        <NavLink to={(auth.isAuthenticated) ? "/vacancies":"/" } className="btn btn-ghost glass text-xl" viewTransition><Share2 />CampusLink</NavLink>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            {isSuccess && (<Avatar user={data} size={'100%'}/>)}
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-lg md:menu-md dropdown-content bg-base-100 rounded-box z-1 mt-5 w-52 p-2 shadow">
            <li><NavLink to="/profile">Профиль</NavLink></li>
            <li><button onClick={logoutHandler}>Выход</button></li>
          </ul>
        </div>
      </div>

    </div>
  )
}
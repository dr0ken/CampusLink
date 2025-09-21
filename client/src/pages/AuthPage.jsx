import { useNavigate } from "react-router";


const AuthPage = () => {

  const navigate = useNavigate();

  const routeChange = () => {
    let path = "/authorized"
    navigate(path)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-300">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Auth Page</h2>
          <div className="items-center my-2 w-full">
            <input type="text" className="grow input input-bordered my-1 w-full" placeholder="Email" />
            <input type="password" className="grow input input-bordered my-1 w-full" placeholder="Password"/>
          </div>
          <div className="card-actions justify-around w-full">
            <button className="btn btn-primary flex-grow" onClick={routeChange}>Login</button>
            <button className="btn btn-accent flex-grow" onClick={routeChange}>Register</button>
          </div>
        </div>
        
      </div>        
    </div>
  )
}
export default AuthPage;
import { Share2 } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {

  const navigate = useNavigate()

  const auth = useContext(AuthContext)

  return (
    <div className="flex grow max-w-[100vw] items-center justify-between px-4">
      <div className="hero flex-col justify-center items-center">
        <div className="hero-content flex-col items-start md:items-center gap-4 text-neutral text-left md:text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-shadow-sm">
            Все возможности<br /><span className="text-primary">У тебя в руках</span>
          </h1>
          <p className="md:text-xl">
            Найди работу, стажировку или исследовательский проект в своем кампусе.
          </p>
          <div className="w-full flex justify-end gap-2">
            <button className="grow btn btn-primary btn-xl" onClick={ () => 
              {
                if (!auth.isAuthenticated)
                  navigate("/login")
                else 
                  navigate("/vacancies")
              }}>
                Смотреть вакансии
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HomePage;
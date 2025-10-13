import { Avatar } from "./Avatar"
import { NavLink } from "react-router"

export const VacancyCard = ({vacancy}) => 
{
  return (
    <div className="card bg-base-100 shadow-xl p-4
                    flex flex-row justify-between items-center
                    w-full md:w-[32em] lg:w-[48em]
                    h-[24em] md:h-[18em] lg:h-[14em]">    
      <div className="flex flex-col justify-start grow self-stretch">
        <NavLink to={'/vacancy/'+vacancy._id}
          className="card-title text-3xl text-neutral text-center md:text-left self-center md:self-auto">
            {vacancy.name}
        </NavLink>
        <h2 
          className="text-xl text-neutral self-center md:self-auto">
            Мест: {vacancy.studentCount} 
        </h2>
        <button className="btn btn-primary mt-auto w-full md:w-48">Откликнуться</button>
      </div>
      <div className="hidden md:flex flex-col align-center text-center gap-2">
        <h1 className="font-bold text-primary text-2xl">{vacancy.creator.profile.name}</h1>
        <Avatar user={vacancy.creator} size='6em'/>
      </div>
    </div>
  )
}
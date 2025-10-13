import { Avatar } from "./Avatar"

export const VacancyCard = ({vacancy}) => 
{
  return (
    <div className="card bg-base-100 shadow-xl items-center
                    flex flex-row justify-between p-4 
                    w-full md:w-[32em] lg:w-[48em]
                    h-[24em] md:h-[18em] lg:h-[14em]">    
      <div className="flex flex-col justify-start grow h-full">
        <h2 className="card-title text-3xl text-neutral text-center self-center md:self-auto">{vacancy.name}</h2>
        <p>{vacancy.description}</p>
        <button className="btn btn-primary mt-auto w-full md:w-48">Откликнуться</button>
      </div>
      <div className="hidden md:block self-start"><Avatar user={vacancy.creator} size='6em'/></div>
    </div>
  )
}
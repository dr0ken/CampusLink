export const Avatar = ({user, size}) => {

  let role;

  if (user.role == "student") role = "Студент"
  else if (user.profile.employerType == "partner") role = "Партнер"
  else role = "Преподаватель"

  return (
    <div className="avatar avatar-placeholder flex-col items-center">
      <div 
        className='bg-neutral text-neutral-content rounded-full'
        style={{width: size, height: size}}>
        <span className="text-2xl">{user.profile.name[0]}</span>
      </div>
      <span className="badge badge-primary mt-2">{role}</span>
    </div>
  )
}
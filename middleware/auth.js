import jwt from 'jsonwebtoken'

const auth = (req, res, next) => 
{
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({message: 'Пользователь не авторизован'})
  }

  try 
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next();
  }
  catch (e) 
  {
    return res.status(401).json({message: 'Invalid token'})
  }
}

export default auth;
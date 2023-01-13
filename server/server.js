const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const moment = require('moment')

const TOKEN_TIMEOUT = 900

const sequelize = require('./db')

const User = require('./models/users')
const Team = require('./models/teams')
const Project = require('./models/projects')

Team.hasMany(User)
Team.hasMany(Project)

const app = express()
app.use(cors())
app.use(express.json())

const authRouter= express.Router()
const adminRouter=express.Router()
const apiRouter=express.Router()

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/api', apiRouter)



apiRouter.use(async (req,res,next) => {
  const token = req.headers.auth
  if (token)
  {
    try {
      const user = await User.findOne({
        where: {
          token: token
        }
      })
      if (!user)
      {
        res.status(401).json({message: 'you shall not pass'})
      }
      else
      {
        if (moment().diff(user.expiry,'seconds')<0)
        {
          next()
        }
        else
        {
          res.status(401).json({message: 'token expired'})
        }
      }
    } catch (err) {
      console.warn(err)
      res.status(500).json({message:'some error'})
    }
  }
  else
  {
    res.status(401).json({message: 'header not provided'})
  }
  
})


app.post('/login' ,async(req, res) => {
  try {
    const credentials = req.body;
    const user = await User.findOne({
      where: {
        username: credentials.username,
        password: credentials.password
      }
    })
    if (user)
    {
      const token = crypto.randomBytes(16).toString('hex')
      user.token = token;
      user.expiry = moment().add(TOKEN_TIMEOUT,'seconds')
      await user.save()
      res.status(200).json({
        message: 'Login Successfull', token
      })
    }
    else
    {
      res.status(401).json({message: 'unauthorized'})
    }
  } catch (error) {
    res.status(500).json({message: 'some server error'})
  }
})

adminRouter.get('/sync', async (req, res, next) => {
  try {
    await sequelize.sync({ force: true })
    const sampleTeams =[{
      teamName: 'Chucky Dolls'
    },{
      teamName: 'Some other team'
    }]

    const sampleProjects = [{
      projectName: 'First Project',
      teamId: 1,
    },
    {
      projectName: 'Second Project',
      teamId: 2,
    },
    {
      projectName: 'Third Project',
      teamId: 1,
    }]

    const sampleUsers = [{
      username: 'giurgi',
      password: 'giurgi123',
      name: 'Giurgiteanu Mihai - Andrei',
      role: 'PM'
    }, {
      username: 'dodi',
      password: 'dodi123',
      name: 'Dodan Diana - Narcisa',
      role: 'PM'
    }, {
      username: 'costinel',
      password: 'costinel23',
      name: 'Draghici Costin',
      role: 'PM'
    },{
      username: 'prof',
      password: 'prof',
      name: 'Toma Andrei',
      role: 'PROF'
    },]
    
    for (const item of sampleTeams) {
      const team = new Team(item)
      await team.save()
    }
    for (const item of sampleProjects) {
      const project = new Project(item)
      await project.save()
    }
    for (const item of sampleUsers) {
      const user = new User(item)
      await user.save()
    }
    res.status(201).json({ message: 'sample db created' })
  } catch (err) {
    next(err)
  }
})

//REST for Users
{
  
  

  adminRouter.get('/users', async (req, res, next) => {
    try {
      const users = await User.findAll()
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  })
  
  adminRouter.post('/users', async (req, res, next) => {
    try {
      const user = await User.create(req.body)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  })

  adminRouter.put('/users/:userId', async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId)
        if (user) {
          user.teamId = req.body.teamId
          await user.save()
          res.status(202).json({ message: 'User updated!' })
        } else {
          res.status(404).json({ message: '404 - Student Not Found!' })
        }
      } 
     catch (err) {
      next(err)
    }
  })
}

//REST for TEAMS
{
  adminRouter.get('/teams', async (req, res, next) => {
    try {
      const teams = await Team.findAll()
      res.status(200).json(teams)
    } catch (err) {
      next(err)
    }
  })
  
  adminRouter.post('/teams', async (req, res, next) => {
    try {
      const team = await Team.create(req.body)
      res.status(201).json(team.id)
    } catch (err) {
      next(err)
    }
  })
}

//REST for PROJECTS
{
  adminRouter.get('/projects', async (req, res, next) => {
    try {
      const projects = await Project.findAll()
      res.status(200).json(projects)
    } catch (err) {
      next(err)
    }
  })
  
  adminRouter.post('/projects', async (req, res, next) => {
    try {
      const project = await Project.create(req.body)
      res.status(201).json(project)
    } catch (err) {
      next(err)
    }
  })

  adminRouter.put('/projects/:projectId', async (req, res, next) => {
    try {
      const project = await Project.findByPk(req.params.projectId)
        if (project) {
          project.grade1 = req.body.grade1
          project.grade2 = req.body.grade2
          project.grade3 = req.body.grade3
          project.grade4 = req.body.grade4
          project.grade5 = req.body.grade5
          await project.save()
          res.status(202).json({ message: 'User updated!' })
        } else {
          res.status(404).json({ message: '404 - Student Not Found!' })
        }
      } 
     catch (err) {
      next(err)
    }
  })
}


app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).json({ message: 'server error' })
})

apiRouter.get('/ping',(req,res) => {
  res.status(201).json({message:'pong'})
})

apiRouter.get('/whologgedin',async (req,res) => {
  const token = req.headers.auth
  const user = await User.findOne({
    where: {
      token: token
    }
  })
  if (user)
  {
    res.status(201).json({message:user.username})
  }
  else
  {
    res.status(401).json({message: 'not logged in'})
  }
  
})

apiRouter.get('/whologgedinID',async (req,res) => {
  const token = req.headers.auth
  const user = await User.findOne({
    where: {
      token: token
    }
  })
  if (user)
  {
    res.status(201).json({message:user.id})
  }
  else
  {
    res.status(401).json({message: 'not logged in'})
  }
  
})

apiRouter.get('/whologgedinIDTeam',async (req,res) => {
  const token = req.headers.auth
  const user = await User.findOne({
    where: {
      token: token
    }
  })
  if (user)
  {
    res.status(201).json({message:user.teamId})
  }
  else
  {
    res.status(401).json({message: 'not logged in'})
  }
  
})

adminRouter.get('/teams/:teamId',async (req,res) => {
  const team = await Team.findByPk(req.params.teamId)
  
  if (team)
  {
    res.status(201).json({message:team.teamName})
  }
  else
  {
    res.status(401).json({message: 'not logged in'})
  }
  
})

adminRouter.get('/projectsTeam', async (req, res, next) => {
  try {
    const teamId1 = req.headers.auth
    console.warn("------------------------------------------------------------------" + req.headers.auth)
    const projects = await Project.findAll({
      where: {
        teamId:teamId1
      }
    })
    res.status(200).json(projects)
  } catch (err) {
    next(err)
  }
})

app.listen(8080)

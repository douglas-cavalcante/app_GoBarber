const { User } = require('../models')

class UserController {
  create (req, res) {
    return res.render('auth/signup')
  }

  async store (req, res) {
    if (req.file) {
      const { name, email, password } = req.body
      if (name && email && password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          const { filename } = req.file
          await User.create({ ...req.body, avatar: filename })
          return res.redirect('/')
        } else {
          req.flash('error', 'Já existe um usuário com esse email')
          return res.redirect('/signup')
        }
      } else {
        req.flash('error', 'Preencha todos os campos')
        return res.redirect('/signup')
      }
    } else {
      req.flash('error', 'Seleciona uma foto de perfil')
      return res.redirect('/signup')
    }
  }
}

module.exports = new UserController()

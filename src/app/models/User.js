const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  // Definição de campos relacionadoa aos Usuário
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      password_hash: DataTypes.STRING,
      provider: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeSave: async user => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8)
          }
        }
      }
    }
  )

  User.prototype.checkPassword = function (password) {
    // this é a intância do usuário
    return bcrypt.compare(password, this.password_hash)
  }

  return User
}

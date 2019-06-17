const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment } = require('../models')

class AvailableController {
  async index (req, res) {
    // Transforma a data recebida via query params em um objeto do moment.
    const date = moment(parseInt(req.query.date))

    // busca todos os agendamentos que o provider selecionado tem no dia selecionado.
    // req.params.provider -> tem o id enviado pela url

    // busca todos os agendamentos entre os horários
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00'
    ]

    // vai percorrer todos os horarios do schedule
    const available = schedule.map(time => {
      // quebra a string
      const [hour, minute] = time.split(':')

      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      return {
        time,
        value: value.format(),
        available:
          value.isAfter(moment()) &&
          !appointments.find(a => moment(a.date).format('HH:mm') === time)
      }
    })
    console.log(available)

    return res.render('available/index', { available })
  }
}

module.exports = new AvailableController()

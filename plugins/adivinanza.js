import { elegirAdivinanza, iniciarJuego, hayJuegoActivo } from '../lib/adivinanzas.js'

let handler = async (m, { conn }) => {
  if (hayJuegoActivo(m.chat)) return m.reply('Ya hay una adivinanza activa en este chat.')

  const adivinanza = elegirAdivinanza()
  if (!adivinanza) return m.reply('*[❗] No hay adivinanzas disponibles.*')

  iniciarJuego(m.chat, adivinanza)

  m.reply(`*Adivinanza:* ${adivinanza.pregunta}\n\nA) ${adivinanza.opciones.A}\nB) ${adivinanza.opciones.B}\nC) ${adivinanza.opciones.C}\n\nResponde con A, B o C en 45 segundos. El primero en acertar gana!*`)
}

handler.command = ['adivinanza']
handler.tags = ['juegos']
handler.help = ['adivinanza']

export default handler

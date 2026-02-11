export function elegirAdivinanza() {
  if (!global.adivinanzas || global.adivinanzas.length === 0) return null
  return global.adivinanzas[Math.floor(Math.random() * global.adivinanzas.length)]
}

export function iniciarJuego(chatId, adivinanza) {
  global.activeGames = global.activeGames || {}
  if (global.activeGames[chatId]) return
  global.activeGames[chatId] = {
    adivinanza,
    answers: {},
    startTime: Date.now(),
    timeout: setTimeout(async () => {
      if (!global.activeGames[chatId]) return
      const game = global.activeGames[chatId]
      const correct = game.adivinanza.respuesta
      let msg = 'Tiempo agotado para la adivinanza.\n\nJugadores:\n'
      for (const [user, ans] of Object.entries(game.answers)) {
        msg += `@${user.split('@')[0]}: ${ans}\n`
      }
      msg += '\n'
      const winners = Object.entries(game.answers).filter(([_, ans]) => ans === correct).map(([user]) => user)
      if (winners.length > 0) {
        msg += 'Ganadores (respondieron correctamente): ' + winners.map(w => `@${w.split('@')[0]}`).join(', ') + ' 🎉'
      } else {
        msg += 'Nadie respondió correctamente.'
      }
      const conn = global.conn
      await conn.sendMessage(chatId, { text: msg, contextInfo: { mentionedJid: Object.keys(game.answers) } })
      delete global.activeGames[chatId]
    }, 45000)
  }
}

export function verificarRespuesta(chatId, respuesta, sender) {
  if (!global.activeGames || !global.activeGames[chatId]) return false
  const game = global.activeGames[chatId]
  const upper = respuesta.toUpperCase()
  if (!['A', 'B', 'C'].includes(upper)) return false 
  if (game.answers[sender]) return false 
  game.answers[sender] = upper
 
  let msg = 'Respuestas hasta ahora:\n'
  for (const [user, ans] of Object.entries(game.answers)) {
    msg += `@${user.split('@')[0]}: ${ans}\n`
  }
  const conn = global.conn
  conn.sendMessage(chatId, { text: msg, contextInfo: { mentionedJid: Object.keys(game.answers) } })
  return true
}

export function terminarJuego(chatId) {
  if (global.activeGames && global.activeGames[chatId]) {
    clearTimeout(global.activeGames[chatId].timeout)
    delete global.activeGames[chatId]
  }
}

export function hayJuegoActivo(chatId) {
  return global.activeGames && global.activeGames[chatId] && !global.activeGames[chatId].winner
}

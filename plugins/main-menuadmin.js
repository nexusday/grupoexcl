let handler = async (m, { usedPrefix }) => {
  const nombreBot = global.namebot
  const tipo = 'Bot'

  const text = [
    `=== Menú Admin ===`,
    ``,
    `Bot: ${nombreBot}`,
    ``,
    `-- Dueños --`,
    `${usedPrefix}verplugin <nombre.js>`,
    `${usedPrefix}replugin <nombre.js>`,
    `${usedPrefix}addplugin <nombre.js>`,
    `${usedPrefix}nameplugins <archivo.js> > <nuevo.js>`,
    `${usedPrefix}ad <nombre>`,
    `${usedPrefix}modad <nombre>`,
    `${usedPrefix}delad <nombre>`,
    `${usedPrefix}update`,
    `${usedPrefix}restart`,
    `${usedPrefix}subme <mensaje>`,
    `${usedPrefix}join <link>`,
    `${usedPrefix}exit`,
    ``,
    `-- Admins --`,
    `${usedPrefix}ban @usuario`,
    `${usedPrefix}promote @usuario`,
    `${usedPrefix}demote @usuario`,
    `${usedPrefix}warn @usuario <motivo>`,
    `${usedPrefix}delwarn @usuario`,
    `${usedPrefix}warnings @usuario`,
    `${usedPrefix}mute @usuario`,
    `${usedPrefix}unmute @usuario`,
    `${usedPrefix}tag`,
    `${usedPrefix}temp <mensaje> <tiempo>`,
    `${usedPrefix}open`,
    `${usedPrefix}close`,
    `${usedPrefix}delete`,
    `${usedPrefix}namegp <nombre>`,
    `${usedPrefix}desgp <descripción>`,
    `${usedPrefix}photogp`,
    `${usedPrefix}adg <numero>`,
    `${usedPrefix}grupo on/off`,
    `${usedPrefix}antilink on/off`,
    `${usedPrefix}antiimg on/off`,
    `${usedPrefix}antiaudio on/off`,
    `${usedPrefix}antivideo on/off`,
    `${usedPrefix}antisticker on/off`,
    `${usedPrefix}antispam on/off`,
    `${usedPrefix}anticontact on/off`,
    `${usedPrefix}antimention on/off`,
    `${usedPrefix}antidocument on/off`,
    `${usedPrefix}anticaracter on/off <limite>`,
    `${usedPrefix}soloadmin on/off`,
  ].join('\n')

  await m.reply(text)
}

handler.command = ['menuadm']
handler.admin = true
export default handler
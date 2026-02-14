import { readFileSync, watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = [
  ['51921487184', 'X Ventas', true],
  ['51901437507', 'Sunkovv', true],
]


global.ownerLid = [
  ['114263544885392', 'sun', true],
  ['182425145614346', 'Sunkovv', true],
]

global.sessions = 'Sessions'
global.bot = 'Serbot' 
global.AFBots = true

global.grupos = true

global.packname = ''
global.namebot = ''
global.author = ''
global.moneda = ''


global.iaPrompt = JSON.parse(readFileSync('./prompt.json')).prompt

global.canal = ''

global.ch = {
ch1: '',
}

global.mods =   []
global.prems = []

global.multiplier = 69 
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})

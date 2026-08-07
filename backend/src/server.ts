import { env } from '@/config/env'
import { createApp, checkDatabaseConnection } from '@/app'
import { prisma } from '@/config/db'

const app = createApp()

async function start(): Promise<void> {
  try {
    await checkDatabaseConnection()
    console.log('🗄️  Connexion à la base de données établie')
  } catch (error) {
    console.error('❌ Connexion à la base de données impossible :', (error as Error).message)
    process.exit(1)
  }

  const server = app.listen(env.PORT, env.HOST, () => {
    console.log(`🚀 API SwissWood démarrée : http://${env.HOST}:${env.PORT}${env.API_PREFIX}`)
  })

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n📦 Signal ${signal} reçu, arrêt gracieux...`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

void start()
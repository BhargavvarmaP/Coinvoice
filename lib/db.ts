import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    // Try to count users as a simple test
    const count = await prisma.user.count()
    console.log('Database connection successful. User count:', count)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Export prisma client for use in other files
export { prisma } 
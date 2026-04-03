import { PrismaClient } from './src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:prisma/dev.db' });
const db = new PrismaClient({ adapter });

async function main() {
  const user = await db.user.upsert({
    where: { email: 'dev@doodigital.co' },
    update: { role: 'admin' },
    create: { email: 'dev@doodigital.co', name: 'Admin', role: 'admin' }
  });
  console.log('Admin user:', user.id, user.role);

  const sub = await db.subscription.upsert({
    where: { userId: user.id },
    update: { plan: 'pro' },
    create: { userId: user.id, plan: 'pro' }
  });
  console.log('Subscription:', sub.id, sub.plan);

  await db.$disconnect();
}

main();

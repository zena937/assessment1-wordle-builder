import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const words = [
    { word: 'THIN', phonemes: ['θ', 'ɪ', 'n'], hint: 'θ ɪ n as in THIN', difficulty: 'EASY' },
    { word: 'SHIP', phonemes: ['ʃ', 'ɪ', 'p'], hint: 'ʃ ɪ p as in SHIP', difficulty: 'EASY' },
    { word: 'CHIN', phonemes: ['tʃ', 'ɪ', 'n'], hint: 'tʃ ɪ n as in CHIN', difficulty: 'MEDIUM' },
    { word: 'JAM', phonemes: ['dʒ', 'æ', 'm'], hint: 'dʒ æ m as in JAM', difficulty: 'EASY' },
    { word: 'FAN', phonemes: ['f', 'æ', 'n'], hint: 'f æ n as in FAN', difficulty: 'EASY' },
  ];

  console.log('🌱 Seeding words...');
  
  for (const w of words) {
    await prisma.word.upsert({
      where: { word: w.word },
      update: {},
      create: w,
    });
  }

  console.log(`✅ Seeded ${words.length} words!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
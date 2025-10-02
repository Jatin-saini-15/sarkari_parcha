import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCMSData() {
  try {
    // Create exam categories if they don't exist
    const sscCategory = await prisma.examCategory.upsert({
      where: { slug: 'ssc' },
      update: {},
      create: {
        name: 'SSC',
        slug: 'ssc',
        description: 'Staff Selection Commission',
        isActive: true,
      },
    });

    const bankingCategory = await prisma.examCategory.upsert({
      where: { slug: 'banking' },
      update: {},
      create: {
        name: 'Banking',
        slug: 'banking',
        description: 'Banking Sector Examinations',
        isActive: true,
      },
    });

    const railwaysCategory = await prisma.examCategory.upsert({
      where: { slug: 'railways' },
      update: {},
      create: {
        name: 'Railways',
        slug: 'railways',
        description: 'Railway Recruitment Board',
        isActive: true,
      },
    });

    // Create exam names for SSC
    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: sscCategory.id, slug: 'cgl' } },
      update: {},
      create: {
        name: 'CGL',
        slug: 'cgl',
        categoryId: sscCategory.id,
        isActive: true,
      },
    });

    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: sscCategory.id, slug: 'chsl' } },
      update: {},
      create: {
        name: 'CHSL',
        slug: 'chsl',
        categoryId: sscCategory.id,
        isActive: true,
      },
    });

    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: sscCategory.id, slug: 'mts' } },
      update: {},
      create: {
        name: 'MTS',
        slug: 'mts',
        categoryId: sscCategory.id,
        isActive: true,
      },
    });

    // Create exam names for Banking
    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: bankingCategory.id, slug: 'ibps-po' } },
      update: {},
      create: {
        name: 'IBPS PO',
        slug: 'ibps-po',
        categoryId: bankingCategory.id,
        isActive: true,
      },
    });

    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: bankingCategory.id, slug: 'ibps-clerk' } },
      update: {},
      create: {
        name: 'IBPS Clerk',
        slug: 'ibps-clerk',
        categoryId: bankingCategory.id,
        isActive: true,
      },
    });

    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: bankingCategory.id, slug: 'sbi-po' } },
      update: {},
      create: {
        name: 'SBI PO',
        slug: 'sbi-po',
        categoryId: bankingCategory.id,
        isActive: true,
      },
    });

    // Create exam names for Railways
    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: railwaysCategory.id, slug: 'rrb-ntpc' } },
      update: {},
      create: {
        name: 'RRB NTPC',
        slug: 'rrb-ntpc',
        categoryId: railwaysCategory.id,
        isActive: true,
      },
    });

    await prisma.examName.upsert({
      where: { categoryId_slug: { categoryId: railwaysCategory.id, slug: 'rrb-je' } },
      update: {},
      create: {
        name: 'RRB JE',
        slug: 'rrb-je',
        categoryId: railwaysCategory.id,
        isActive: true,
      },
    });

    // Create exam years
    const currentYear = new Date().getFullYear();
    for (const category of [sscCategory, bankingCategory, railwaysCategory]) {
      for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        await prisma.examYear.upsert({
          where: { categoryId_year: { categoryId: category.id, year } },
          update: {},
          create: {
            year,
            categoryId: category.id,
            isActive: true,
          },
        });
      }
    }

    console.log('✅ CMS sample data seeded successfully!');
    console.log('Created categories: SSC, Banking, Railways');
    console.log('Created exam names and years for testing');
  } catch (error) {
    console.error('Error seeding CMS data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCMSData().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
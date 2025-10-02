const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking current database contents...\n');
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`👥 Users: ${users.length}`);
    users.forEach(user => console.log(`  - ${user.email} (${user.role})`));
    
    // Check categories
    const categories = await prisma.examCategory.findMany();
    console.log(`\n📚 Categories: ${categories.length}`);
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`));
    
    // Check exam names
    const examNames = await prisma.examName.findMany({
      include: { category: true }
    });
    console.log(`\n📝 Exam Names: ${examNames.length}`);
    examNames.forEach(exam => console.log(`  - ${exam.name} in ${exam.category.name}`));
    
    // Check mock tests
    const mockTests = await prisma.mockTest.findMany({
      include: { 
        category: true, 
        examName: true,
        _count: { select: { questions: true } }
      }
    });
    console.log(`\n🧪 Mock Tests: ${mockTests.length}`);
    mockTests.forEach(test => console.log(`  - ${test.title} (${test._count.questions} questions) - ${test.testType}`));
    
    // Check exams (old structure)
    const exams = await prisma.exam.findMany({
      include: { examName: true }
    });
    console.log(`\n📋 Exams: ${exams.length}`);
    exams.forEach(exam => console.log(`  - ${exam.title} (${exam.examType})`));
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

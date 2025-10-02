const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickRecovery() {
  try {
    console.log('🚀 Starting quick recovery...\n');
    
    // Create some sample users for testing
    console.log('👥 Creating sample users...');
    const testUsers = [
      { email: 'test1@example.com', name: 'Test User 1', role: 'user' },
      { email: 'test2@example.com', name: 'Test User 2', role: 'user' },
      { email: 'premium@example.com', name: 'Premium User', role: 'user', isPremium: true }
    ];
    
    for (const userData of testUsers) {
      try {
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`  ✅ Created user: ${user.email}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`  ⚠️  User already exists: ${userData.email}`);
        } else {
          console.log(`  ❌ Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    // Create some sample mock tests for different categories
    console.log('\n🧪 Creating sample mock tests...');
    
    const sscCategory = await prisma.examCategory.findFirst({ where: { slug: 'ssc' } });
    const cglExam = await prisma.examName.findFirst({ where: { slug: 'cgl' } });
    const chslExam = await prisma.examName.findFirst({ where: { slug: 'chsl' } });
    
    if (sscCategory && cglExam) {
      // Create sample CGL mock test
      try {
        const mockTest = await prisma.mockTest.create({
          data: {
            title: 'SSC CGL Mock Test - Sample',
            slug: `ssc-cgl-sample-${Date.now()}`,
            duration: 60,
            totalMarks: 50,
            testType: 'mock',
            categoryId: sscCategory.id,
            examNameId: cglExam.id,
            isActive: true,
            isFree: true
          }
        });
        
        // Add some sample questions
        const sampleQuestions = [
          {
            questionText: "What is the capital of India?",
            optionA: "Mumbai", optionB: "Delhi", optionC: "Kolkata", optionD: "Chennai",
            correctOption: "B", marks: 2
          },
          {
            questionText: "Who is known as the Father of the Nation in India?",
            optionA: "Jawaharlal Nehru", optionB: "Mahatma Gandhi", optionC: "Sardar Patel", optionD: "Dr. APJ Abdul Kalam",
            correctOption: "B", marks: 2
          }
        ];
        
        for (let i = 0; i < sampleQuestions.length; i++) {
          await prisma.question.create({
            data: {
              ...sampleQuestions[i],
              mockTestId: mockTest.id,
              questionNumber: i + 1
            }
          });
        }
        
        console.log(`  ✅ Created SSC CGL Mock Test with ${sampleQuestions.length} questions`);
      } catch (error) {
        console.log(`  ❌ Error creating CGL mock test:`, error.message);
      }
    }
    
    if (sscCategory && chslExam) {
      // Create sample CHSL PYQ
      try {
        const pyqExam = await prisma.exam.create({
          data: {
            title: 'SSC CHSL 2023 - Sample PYQ',
            slug: `ssc-chsl-2023-sample-${Date.now()}`,
            examType: 'pyq',
            examUrl: '',
            duration: 60,
            totalMarks: 50,
            isActive: true,
            isFree: true,
            examNameId: chslExam.id
          }
        });
        
        const mockTest = await prisma.mockTest.create({
          data: {
            title: 'SSC CHSL 2023 - Sample PYQ',
            slug: `ssc-chsl-2023-pyq-${Date.now()}`,
            duration: 60,
            totalMarks: 50,
            testType: 'pyq',
            categoryId: sscCategory.id,
            examNameId: chslExam.id,
            isActive: true,
            isFree: true
          }
        });
        
        // Update exam with test URL
        await prisma.exam.update({
          where: { id: pyqExam.id },
          data: { examUrl: `/test/${mockTest.id}` }
        });
        
        console.log(`  ✅ Created SSC CHSL PYQ`);
      } catch (error) {
        console.log(`  ❌ Error creating CHSL PYQ:`, error.message);
      }
    }
    
    console.log('\n✅ Quick recovery completed!');
    console.log('\n📝 Summary:');
    console.log('- Sample users created for testing');
    console.log('- Sample mock tests and PYQs created');
    console.log('- All existing categories and exam names preserved');
    console.log('\n🎯 You can now:');
    console.log('1. Upload your actual test files via /admin/studio');
    console.log('2. Test the functionality with sample data');
    console.log('3. Create more users as needed');
    
  } catch (error) {
    console.error('❌ Error during recovery:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickRecovery();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Create admin user first
  console.log('Creating admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@sarkariparcha.in' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@sarkariparcha.in',
      role: 'admin',
      isPremium: true,
      premiumUntil: new Date('2099-12-31')
    }
  });

  // Exam Categories
  console.log('Seeding exam categories...');
  const categories = [
    { name: 'SSC Exams', slug: 'ssc', description: 'Staff Selection Commission exams including CGL, CHSL, MTS, CPO, JE' },
    { name: 'Banking', slug: 'banking', description: 'Banking sector exams including IBPS PO/Clerk, SBI PO/Clerk, RBI' },
    { name: 'Railways (RRB)', slug: 'railways', description: 'Railway Recruitment Board exams including NTPC, Group D, JE' },
    { name: 'Defence', slug: 'defence', description: 'Defence exams including NDA, CDS, AFCAT, Agniveer' },
    { name: 'Teaching', slug: 'teaching', description: 'Teaching exams including CTET, UPTET, Super TET' },
    { name: 'UPSC', slug: 'upsc', description: 'Union Public Service Commission exams including IAS, IES, CMS' },
    { name: 'State PSC', slug: 'state-psc', description: 'State Public Service Commission exams including UPPSC, BPSC, MPPSC' },
    { name: 'Police Recruitment', slug: 'police', description: 'Police recruitment exams including UP Police, Delhi Police' },
    { name: 'Insurance Exams', slug: 'insurance', description: 'Insurance sector exams including LIC AAO, NIACL AO' },
    { name: 'Judiciary Exams', slug: 'judiciary', description: 'Judicial service exams including District Court, High Court' },
    { name: 'Entrance Exams', slug: 'entrance', description: 'Government college entrance exams including CUET, Polytechnic' }
  ];

  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.examCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
    createdCategories.push(createdCategory);
  }

  // Exam Names for each category
  console.log('Seeding exam names...');
  const examNamesData = {
    ssc: [
      { name: 'Combined Graduate Level (CGL)', slug: 'cgl' },
      { name: 'Combined Higher Secondary Level (CHSL)', slug: 'chsl' },
      { name: 'Multi Tasking Staff (MTS)', slug: 'mts' },
      { name: 'Constable (GD)', slug: 'constable' },
      { name: 'Junior Engineer (JE)', slug: 'je' },
      { name: 'Central Police Organization (CPO)', slug: 'cpo' },
      { name: 'Selection Post', slug: 'selection-post' },
      { name: 'Stenographer', slug: 'stenographer' }
    ],
    banking: [
      { name: 'IBPS PO', slug: 'ibps-po' },
      { name: 'IBPS Clerk', slug: 'ibps-clerk' },
      { name: 'SBI PO', slug: 'sbi-po' },
      { name: 'SBI Clerk', slug: 'sbi-clerk' },
      { name: 'RBI Grade B', slug: 'rbi-grade-b' },
      { name: 'RBI Assistant', slug: 'rbi-assistant' },
      { name: 'NABARD Grade A', slug: 'nabard-grade-a' },
      { name: 'IBPS SO', slug: 'ibps-so' }
    ],
    railways: [
      { name: 'RRB NTPC', slug: 'rrb-ntpc' },
      { name: 'RRB Group D', slug: 'rrb-group-d' },
      { name: 'RRB JE', slug: 'rrb-je' },
      { name: 'RRB ALP', slug: 'rrb-alp' },
      { name: 'RRB TC', slug: 'rrb-tc' },
      { name: 'RRB ASM', slug: 'rrb-asm' }
    ],
    defence: [
      { name: 'NDA', slug: 'nda' },
      { name: 'CDS', slug: 'cds' },
      { name: 'AFCAT', slug: 'afcat' },
      { name: 'Agniveer', slug: 'agniveer' },
      { name: 'Indian Navy MR', slug: 'navy-mr' },
      { name: 'Indian Army Clerk', slug: 'army-clerk' }
    ],
    teaching: [
      { name: 'CTET', slug: 'ctet' },
      { name: 'UPTET', slug: 'uptet' },
      { name: 'Super TET', slug: 'super-tet' },
      { name: 'HTET', slug: 'htet' },
      { name: 'REET', slug: 'reet' }
    ],
    upsc: [
      { name: 'Civil Services (IAS)', slug: 'ias' },
      { name: 'Engineering Services (IES)', slug: 'ies' },
      { name: 'Central Armed Police Forces (CAPF)', slug: 'capf' },
      { name: 'Indian Forest Service (IFS)', slug: 'ifs' }
    ],
    'state-psc': [
      { name: 'UPPSC PCS', slug: 'uppsc-pcs' },
      { name: 'BPSC', slug: 'bpsc' },
      { name: 'MPPSC', slug: 'mppsc' },
      { name: 'RPSC RAS', slug: 'rpsc-ras' }
    ],
    police: [
      { name: 'UP Police Constable', slug: 'up-police-constable' },
      { name: 'Delhi Police Constable', slug: 'delhi-police-constable' },
      { name: 'CISF Constable', slug: 'cisf-constable' },
      { name: 'BSF Constable', slug: 'bsf-constable' }
    ]
  };

  const allExamNames = [];
  for (const [categorySlug, examNames] of Object.entries(examNamesData)) {
    const category = createdCategories.find(cat => cat.slug === categorySlug);
    if (category) {
      for (const examName of examNames) {
        const createdExamName = await prisma.examName.upsert({
          where: { categoryId_slug: { categoryId: category.id, slug: examName.slug } },
          update: {},
          create: { ...examName, categoryId: category.id }
        });
        allExamNames.push({ ...createdExamName, categorySlug });
      }
    }
  }

  // Exam Years
  console.log('Seeding exam years...');
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
  const allExamYears = [];

  for (const category of createdCategories) {
    for (const year of years) {
      const examYear = await prisma.examYear.upsert({
        where: { categoryId_year: { categoryId: category.id, year } },
        update: {},
        create: { year, categoryId: category.id, isActive: true }
      });
      allExamYears.push({ ...examYear, categorySlug: category.slug });
    }
  }

  // Test Series
  console.log('Seeding test series...');
  const testSeriesData = [
    { name: 'SSC CGL Complete Test Series', slug: 'ssc-cgl-complete-test-series', categorySlug: 'ssc', description: 'Comprehensive test series for SSC CGL preparation' },
    { name: 'SSC CHSL Foundation Series', slug: 'ssc-chsl-foundation', categorySlug: 'ssc', description: 'Foundation level tests for SSC CHSL' },
    { name: 'Banking PO Master Series', slug: 'banking-po-master-series', categorySlug: 'banking', description: 'Complete preparation for Banking PO exams' },
    { name: 'Railway NTPC Practice Series', slug: 'railway-ntpc-practice', categorySlug: 'railways', description: 'Practice tests for Railway NTPC' },
    { name: 'Defence NDA Preparation', slug: 'defence-nda-preparation', categorySlug: 'defence', description: 'NDA exam preparation series' },
    { name: 'Teaching CTET Series', slug: 'teaching-ctet-series', categorySlug: 'teaching', description: 'CTET preparation test series' }
  ];

  const allTestSeries = [];
  for (const testSeries of testSeriesData) {
    const category = createdCategories.find(cat => cat.slug === testSeries.categorySlug);
    if (category) {
      const createdTestSeries = await prisma.testSeries.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: testSeries.slug } },
        update: {},
        create: {
          name: testSeries.name,
          slug: testSeries.slug,
          description: testSeries.description,
          categoryId: category.id,
          isActive: true,
          isFree: Math.random() > 0.7 // 30% free
        }
      });
      allTestSeries.push(createdTestSeries);
    }
  }

  // Generate 125+ Exams
  console.log('Seeding comprehensive exam collection (125+ exams)...');
  let examCount = 0;

  // Helper function to generate exam URL
  const generateExamUrl = (type: string, category: string, examName: string, year: number) => {
    return `https://testzone.sarkariparcha.com/${type}/${category}/${examName}/${year}`;
  };

  // Generate PYQ Exams
  for (const examName of allExamNames) {
    const category = createdCategories.find(cat => cat.id === examName.categoryId);
    if (!category) continue;

    const examYears = allExamYears.filter(ey => ey.categorySlug === category.slug);
    
    for (const examYear of examYears) {
      // Generate 2-4 exams per exam name per year
      const examCount_per_year = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 1; i <= examCount_per_year; i++) {
        const sessionTypes = ['Morning', 'Evening', 'Afternoon', 'General'];
        const tierTypes = ['Tier 1', 'Tier 2', 'Preliminary', 'Mains', 'Paper 1', 'Paper 2'];
        
        const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
        const tierType = tierTypes[Math.floor(Math.random() * tierTypes.length)];
        
        const exam = await prisma.exam.create({
          data: {
            title: `${examName.name} ${examYear.year} ${tierType} - ${sessionType} Session`,
            slug: `${examName.slug}-${examYear.year}-${tierType.toLowerCase().replace(' ', '-')}-${sessionType.toLowerCase()}-${i}`,
            description: `${examName.name} ${examYear.year} ${tierType} examination ${sessionType} session`,
            examUrl: generateExamUrl('pyq', category.slug, examName.slug, examYear.year),
            examType: 'pyq',
            isActive: true,
            isFree: Math.random() > 0.6, // 40% free
            duration: Math.floor(Math.random() * 120) + 60, // 60-180 minutes
            totalMarks: Math.floor(Math.random() * 200) + 100, // 100-300 marks
            yearId: examYear.id,
            examNameId: examName.id
          }
        });
        examCount++;
      }
    }
  }

  // Generate Mock Test Exams for Test Series
  for (const testSeries of allTestSeries) {
    const category = createdCategories.find(cat => cat.id === testSeries.categoryId);
    if (!category) continue;

    // Generate 5-10 mock tests per test series
    const mockTestCount = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 1; i <= mockTestCount; i++) {
      const exam = await prisma.exam.create({
        data: {
          title: `${testSeries.name} - Mock Test ${i}`,
          slug: `${testSeries.slug}-mock-test-${i}`,
          description: `Mock Test ${i} from ${testSeries.name}`,
          examUrl: generateExamUrl('mock', category.slug, testSeries.slug, 2024),
          examType: 'mock',
          isActive: true,
          isFree: testSeries.isFree,
          duration: Math.floor(Math.random() * 120) + 60,
          totalMarks: Math.floor(Math.random() * 200) + 100,
          testSeriesId: testSeries.id
        }
      });
      examCount++;
    }
  }

  // Generate Live Test Exams
  for (const category of createdCategories.slice(0, 5)) { // Only for top 5 categories
    const liveTestCount = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 1; i <= liveTestCount; i++) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30)); // Next 30 days
      
      const endDate = new Date(scheduledDate);
      endDate.setHours(endDate.getHours() + 2); // 2 hours duration
      
      const exam = await prisma.exam.create({
        data: {
          title: `${category.name} Live Test ${i}`,
          slug: `${category.slug}-live-test-${i}`,
          description: `Live test for ${category.name} - All India Test Series`,
          examUrl: generateExamUrl('live', category.slug, 'live-test', 2024),
          examType: 'live',
          isActive: true,
          isFree: Math.random() > 0.8, // 20% free
          duration: 120,
          totalMarks: 200,
          scheduledAt: scheduledDate,
          examEndTime: endDate
        }
      });
      examCount++;
    }
  }

  console.log(`✅ Database seeding completed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - Categories: ${createdCategories.length}`);
  console.log(`   - Exam Names: ${allExamNames.length}`);
  console.log(`   - Exam Years: ${allExamYears.length}`);
  console.log(`   - Test Series: ${allTestSeries.length}`);
  console.log(`   - Total Exams: ${examCount}`);
  console.log(`🎉 Your data has been restored and enhanced!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
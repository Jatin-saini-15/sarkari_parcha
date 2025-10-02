import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding exam names...');

  // Get all categories first
  const categories = await prisma.examCategory.findMany();

  const examNamesByCategory = {
    'ssc': [
      { name: 'CGL (Combined Graduate Level)', slug: 'cgl' },
      { name: 'CHSL (Combined Higher Secondary Level)', slug: 'chsl' },
      { name: 'MTS (Multi Tasking Staff)', slug: 'mts' },
      { name: 'CPO (Central Police Organisation)', slug: 'cpo' },
      { name: 'JE (Junior Engineer)', slug: 'je' },
      { name: 'Stenographer', slug: 'stenographer' },
      { name: 'GD Constable', slug: 'gd-constable' }
    ],
    'banking': [
      { name: 'IBPS PO (Probationary Officer)', slug: 'ibps-po' },
      { name: 'IBPS Clerk', slug: 'ibps-clerk' },
      { name: 'SBI PO', slug: 'sbi-po' },
      { name: 'SBI Clerk', slug: 'sbi-clerk' },
      { name: 'RBI Grade B', slug: 'rbi-grade-b' },
      { name: 'RBI Assistant', slug: 'rbi-assistant' },
      { name: 'NABARD Grade A', slug: 'nabard-grade-a' }
    ],
    'railways': [
      { name: 'NTPC (Non-Technical Popular Categories)', slug: 'ntpc' },
      { name: 'Group D', slug: 'group-d' },
      { name: 'JE (Junior Engineer)', slug: 'je' },
      { name: 'ALP (Assistant Loco Pilot)', slug: 'alp' },
      { name: 'TC (Train Conductor)', slug: 'tc' },
      { name: 'RPF Constable', slug: 'rpf-constable' }
    ],
    'defence': [
      { name: 'NDA (National Defence Academy)', slug: 'nda' },
      { name: 'CDS (Combined Defence Services)', slug: 'cds' },
      { name: 'AFCAT (Air Force Common Admission Test)', slug: 'afcat' },
      { name: 'Agniveer Army', slug: 'agniveer-army' },
      { name: 'Agniveer Navy', slug: 'agniveer-navy' },
      { name: 'Agniveer Air Force', slug: 'agniveer-air-force' }
    ],
    'teaching': [
      { name: 'CTET (Central Teacher Eligibility Test)', slug: 'ctet' },
      { name: 'UPTET', slug: 'uptet' },
      { name: 'Super TET', slug: 'super-tet' },
      { name: 'KVS PGT', slug: 'kvs-pgt' },
      { name: 'KVS TGT', slug: 'kvs-tgt' },
      { name: 'DSSSB TGT', slug: 'dsssb-tgt' }
    ],
    'upsc': [
      { name: 'IAS (Indian Administrative Service)', slug: 'ias' },
      { name: 'IES (Indian Engineering Services)', slug: 'ies' },
      { name: 'CMS (Combined Medical Services)', slug: 'cms' },
      { name: 'CAPF (Central Armed Police Forces)', slug: 'capf' },
      { name: 'NDA & NA', slug: 'nda-na' }
    ],
    'state-psc': [
      { name: 'UPPSC PCS', slug: 'uppsc-pcs' },
      { name: 'BPSC', slug: 'bpsc' },
      { name: 'MPPSC', slug: 'mppsc' },
      { name: 'RPSC RAS', slug: 'rpsc-ras' },
      { name: 'HPSC HCS', slug: 'hpsc-hcs' },
      { name: 'GPSC', slug: 'gpsc' }
    ],
    'police': [
      { name: 'UP Police Constable', slug: 'up-police-constable' },
      { name: 'Delhi Police Constable', slug: 'delhi-police-constable' },
      { name: 'SSC CPO', slug: 'ssc-cpo' },
      { name: 'CISF Constable', slug: 'cisf-constable' },
      { name: 'BSF Constable', slug: 'bsf-constable' }
    ]
  };

  for (const category of categories) {
    const examNames = examNamesByCategory[category.slug as keyof typeof examNamesByCategory];
    
    if (examNames) {
      for (const examName of examNames) {
        await prisma.examName.upsert({
          where: {
            categoryId_slug: {
              categoryId: category.id,
              slug: examName.slug
            }
          },
          update: {},
          create: {
            name: examName.name,
            slug: examName.slug,
            categoryId: category.id,
            isActive: true
          }
        });
      }
      console.log(`✓ Seeded exam names for ${category.name}`);
    }
  }

  console.log('Exam names seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
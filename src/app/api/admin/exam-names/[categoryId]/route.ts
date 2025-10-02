import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hardcoded exam names as fallback
interface ExamNameType {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  isActive: boolean;
}

const hardcodedExamNames: { [key: string]: ExamNameType[] } = {
  'ssc': [
    { id: 'cgl', name: 'CGL (Combined Graduate Level)', slug: 'cgl', categoryId: 'ssc', isActive: true },
    { id: 'chsl', name: 'CHSL (Combined Higher Secondary Level)', slug: 'chsl', categoryId: 'ssc', isActive: true },
    { id: 'mts', name: 'MTS (Multi Tasking Staff)', slug: 'mts', categoryId: 'ssc', isActive: true },
    { id: 'cpo', name: 'CPO (Central Police Organisation)', slug: 'cpo', categoryId: 'ssc', isActive: true },
    { id: 'je', name: 'JE (Junior Engineer)', slug: 'je', categoryId: 'ssc', isActive: true },
    { id: 'stenographer', name: 'Stenographer', slug: 'stenographer', categoryId: 'ssc', isActive: true },
    { id: 'gd-constable', name: 'GD Constable', slug: 'gd-constable', categoryId: 'ssc', isActive: true }
  ],
  'banking': [
    { id: 'ibps-po', name: 'IBPS PO (Probationary Officer)', slug: 'ibps-po', categoryId: 'banking', isActive: true },
    { id: 'ibps-clerk', name: 'IBPS Clerk', slug: 'ibps-clerk', categoryId: 'banking', isActive: true },
    { id: 'sbi-po', name: 'SBI PO', slug: 'sbi-po', categoryId: 'banking', isActive: true },
    { id: 'sbi-clerk', name: 'SBI Clerk', slug: 'sbi-clerk', categoryId: 'banking', isActive: true },
    { id: 'rbi-grade-b', name: 'RBI Grade B', slug: 'rbi-grade-b', categoryId: 'banking', isActive: true },
    { id: 'rbi-assistant', name: 'RBI Assistant', slug: 'rbi-assistant', categoryId: 'banking', isActive: true },
    { id: 'nabard-grade-a', name: 'NABARD Grade A', slug: 'nabard-grade-a', categoryId: 'banking', isActive: true }
  ],
  'railways': [
    { id: 'ntpc', name: 'NTPC (Non-Technical Popular Categories)', slug: 'ntpc', categoryId: 'railways', isActive: true },
    { id: 'group-d', name: 'Group D', slug: 'group-d', categoryId: 'railways', isActive: true },
    { id: 'je', name: 'JE (Junior Engineer)', slug: 'je', categoryId: 'railways', isActive: true },
    { id: 'alp', name: 'ALP (Assistant Loco Pilot)', slug: 'alp', categoryId: 'railways', isActive: true },
    { id: 'tc', name: 'TC (Train Conductor)', slug: 'tc', categoryId: 'railways', isActive: true },
    { id: 'rpf-constable', name: 'RPF Constable', slug: 'rpf-constable', categoryId: 'railways', isActive: true }
  ],
  'defence': [
    { id: 'nda', name: 'NDA (National Defence Academy)', slug: 'nda', categoryId: 'defence', isActive: true },
    { id: 'cds', name: 'CDS (Combined Defence Services)', slug: 'cds', categoryId: 'defence', isActive: true },
    { id: 'afcat', name: 'AFCAT (Air Force Common Admission Test)', slug: 'afcat', categoryId: 'defence', isActive: true },
    { id: 'agniveer-army', name: 'Agniveer Army', slug: 'agniveer-army', categoryId: 'defence', isActive: true },
    { id: 'agniveer-navy', name: 'Agniveer Navy', slug: 'agniveer-navy', categoryId: 'defence', isActive: true },
    { id: 'agniveer-air-force', name: 'Agniveer Air Force', slug: 'agniveer-air-force', categoryId: 'defence', isActive: true }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    // Try database first
    try {
      const examNames = await prisma.examName.findMany({
        where: {
          categoryId,
          isActive: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      if (examNames.length > 0) {
        return NextResponse.json({ examNames });
      }
    } catch (dbError) {
      console.log('Database error, using hardcoded exam names:', dbError);
    }

    // Fallback to hardcoded exam names
    const examNames = hardcodedExamNames[categoryId] || [];
    return NextResponse.json({ examNames });
  } catch (error) {
    console.error('Error fetching exam names:', error);
    // Even if everything fails, return hardcoded exam names  
    try {
      const { categoryId } = await params;
      const examNames = hardcodedExamNames[categoryId] || [];
      return NextResponse.json({ examNames });
    } catch {
      return NextResponse.json({ examNames: [] });
    }
  }
} 
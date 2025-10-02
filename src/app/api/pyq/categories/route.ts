import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Popularity order for sorting
const popularityOrder = [
  'ssc', 'railways', 'banking', 'defence', 'teaching', 
  'upsc', 'state-psc', 'police', 'insurance', 'judiciary', 'entrance'
];

export async function GET() {
  try {
    const categories = await prisma.examCategory.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            examYears: {
              where: {
                exams: {
                  some: {
                    examType: 'pyq',
                    isActive: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Filter categories that actually have PYQ exams
    const categoriesWithPYQs = categories.filter(category => category._count.examYears > 0);

    // Sort categories by popularity order
    const sortedCategories = categoriesWithPYQs.sort((a, b) => {
      const aIndex = popularityOrder.indexOf(a.slug);
      const bIndex = popularityOrder.indexOf(b.slug);
      
      // If both are in popularity order, sort by index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in popularity order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // If neither is in popularity order, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ categories: sortedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
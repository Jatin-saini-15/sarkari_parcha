import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

interface MockTestRow {
  title: string;
  examUrl: string;
  category: string; // Category name
  durationHours?: number;
  durationMinutes?: number;
  totalMarks?: number;
  isFree: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (jsonData.length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // Get all categories for lookup
    const categories = await prisma.examCategory.findMany();

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < jsonData.length; i++) {
      const rowNum = i + 2; // Excel row number (accounting for header)
      const row = jsonData[i];

      try {
        // Parse and validate row data
        const mockTestData: MockTestRow = {
          title: String(row.title || row.Title || row.testName || row['Test Name'] || '').trim(),
          examUrl: String(row.examUrl || row['Exam URL'] || row.url || row.URL || '').trim(),
          category: String(row.category || row.Category || '').trim(),
          durationHours: parseInt(row.durationHours || row['Duration Hours'] || '1') || 1,
          durationMinutes: parseInt(row.durationMinutes || row['Duration Minutes'] || '0') || 0,
          totalMarks: parseInt(row.totalMarks || row['Total Marks'] || '100'),
          isFree: (() => {
            const rawValue = row.isFree || row['Is Free'] || row.free;
            if (rawValue === false || rawValue === 0) return false;
            if (rawValue === true || rawValue === 1) return true;
            const freeValue = String(rawValue || 'true').toLowerCase().trim();
            return freeValue === 'true' || freeValue === '1' || freeValue === 'yes';
          })()
        };

        // Validate required fields
        if (!mockTestData.title) {
          results.errors.push(`Row ${rowNum}: Title is required`);
          results.failed++;
          continue;
        }

        if (!mockTestData.examUrl) {
          results.errors.push(`Row ${rowNum}: Exam URL is required`);
          results.failed++;
          continue;
        }

        if (!mockTestData.category) {
          results.errors.push(`Row ${rowNum}: Category is required`);
          results.failed++;
          continue;
        }

        if (!mockTestData.totalMarks || mockTestData.totalMarks <= 0) {
          results.errors.push(`Row ${rowNum}: Valid total marks is required`);
          results.failed++;
          continue;
        }

        // Find category
        const category = categories.find((c: any) => 
          c.name.toLowerCase() === mockTestData.category.toLowerCase() ||
          c.slug.toLowerCase() === mockTestData.category.toLowerCase()
        );

        if (!category) {
          results.errors.push(`Row ${rowNum}: Category "${mockTestData.category}" not found`);
          results.failed++;
          continue;
        }

        // Calculate duration in minutes
        const duration = ((mockTestData.durationHours || 0) * 60) + (mockTestData.durationMinutes || 0);

        if (duration <= 0) {
          results.errors.push(`Row ${rowNum}: Duration must be greater than 0`);
          results.failed++;
          continue;
        }

        // Generate slug
        const baseSlug = `${category.slug}-${mockTestData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slug
        while (await prisma.exam.findFirst({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Create a dummy exam year for the current year (required by schema)
        const currentYear = new Date().getFullYear();
        let examYear = await prisma.examYear.findFirst({
          where: {
            year: currentYear,
            categoryId: category.id
          }
        });

        if (!examYear) {
          examYear = await prisma.examYear.create({
            data: {
              year: currentYear,
              categoryId: category.id
            }
          });
        }

        // Create exam
        await prisma.exam.create({
          data: {
            title: mockTestData.title,
            slug,
            examUrl: mockTestData.examUrl,
            examType: 'mock',
            isActive: true,
            isFree: mockTestData.isFree,
            duration,
            totalMarks: mockTestData.totalMarks,
            yearId: examYear.id
          }
        });

        results.success++;

      } catch (error) {
        console.error(`Error processing row ${rowNum}:`, error);
        results.errors.push(`Row ${rowNum}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.failed++;
      }
    }

    return NextResponse.json({
      message: `Bulk upload completed. ${results.success} successful, ${results.failed} failed.`,
      results
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

interface PYQRow {
  title: string;
  examUrl: string;
  category: string; // Category name
  examName?: string; // Exam name (optional)
  year: number;
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

    // Get all categories and exam names for lookup
    const categories = await prisma.examCategory.findMany();
    const examNames = await prisma.examName.findMany();

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
        const pyqData: PYQRow = {
          title: String(row.title || row.Title || '').trim(),
          examUrl: String(row.examUrl || row['Exam URL'] || row.url || row.URL || '').trim(),
          category: String(row.category || row.Category || '').trim(),
          examName: String(row.examName || row['Exam Name'] || row.exam || '').trim(),
          year: parseInt(row.year || row.Year || ''),
          durationHours: parseInt(row.durationHours || row['Duration Hours'] || '0') || 0,
          durationMinutes: parseInt(row.durationMinutes || row['Duration Minutes'] || '0') || 0,
          totalMarks: parseInt(row.totalMarks || row['Total Marks'] || ''),
          isFree: (() => {
            const rawValue = row.isFree || row['Is Free'] || row.free;
            if (rawValue === false || rawValue === 0) return false;
            if (rawValue === true || rawValue === 1) return true;
            const freeValue = String(rawValue || 'true').toLowerCase().trim();
            return freeValue === 'true' || freeValue === '1' || freeValue === 'yes';
          })()
        };

        // Validate required fields
        if (!pyqData.title) {
          results.errors.push(`Row ${rowNum}: Title is required`);
          results.failed++;
          continue;
        }

        if (!pyqData.examUrl) {
          results.errors.push(`Row ${rowNum}: Exam URL is required`);
          results.failed++;
          continue;
        }

        if (!pyqData.category) {
          results.errors.push(`Row ${rowNum}: Category is required`);
          results.failed++;
          continue;
        }

        if (!pyqData.year || pyqData.year < 2000 || pyqData.year > new Date().getFullYear()) {
          results.errors.push(`Row ${rowNum}: Valid year is required`);
          results.failed++;
          continue;
        }

        // Find category
        const category = categories.find((c: any) => 
          c.name.toLowerCase() === pyqData.category.toLowerCase() ||
          c.slug.toLowerCase() === pyqData.category.toLowerCase()
        );

        if (!category) {
          results.errors.push(`Row ${rowNum}: Category "${pyqData.category}" not found`);
          results.failed++;
          continue;
        }

        // Find exam name if provided
        let examName = null;
        if (pyqData.examName && pyqData.examName.trim()) {
          examName = examNames.find((e: any) => 
            e.categoryId === category.id && (
              e.name.toLowerCase() === pyqData.examName!.toLowerCase() ||
              e.slug.toLowerCase() === pyqData.examName!.toLowerCase()
            )
          );

          if (!examName) {
            results.errors.push(`Row ${rowNum}: Exam name "${pyqData.examName}" not found for category "${pyqData.category}"`);
            results.failed++;
            continue;
          }
        }

        // Find or create exam year
        let examYear = await prisma.examYear.findFirst({
          where: {
            year: pyqData.year,
            categoryId: category.id
          }
        });

        if (!examYear) {
          examYear = await prisma.examYear.create({
            data: {
              year: pyqData.year,
              categoryId: category.id
            }
          });
        }

        // Calculate duration in minutes
        const duration = ((pyqData.durationHours || 0) * 60) + (pyqData.durationMinutes || 0);

        // Generate slug
        const baseSlug = `${category.slug}-${pyqData.year}-${pyqData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slug
        while (await prisma.exam.findFirst({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Log for debugging
        console.log(`Creating exam: ${pyqData.title}, isFree: ${pyqData.isFree} (original value: ${row.isFree})`);

        // Create exam
        await prisma.exam.create({
          data: {
            title: pyqData.title,
            slug,
            examUrl: pyqData.examUrl,
            examType: 'pyq',
            isActive: true,
            isFree: pyqData.isFree,
            duration: duration > 0 ? duration : null,
            totalMarks: pyqData.totalMarks || null,
            yearId: examYear.id,
            examNameId: examName?.id || null
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
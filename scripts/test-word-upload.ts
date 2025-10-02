import { prisma } from '../src/lib/prisma'
import { simpleWordProcessor } from '../src/lib/word-processing'
import { readFile } from 'fs/promises'
import path from 'path'

function slugify(text: string) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/&/g, '-and-').replace(/[^a-z0-9\-]+/g, '').replace(/\-\-+/g, '-').replace(/^\-+/, '').replace(/\-+$/, '')
}

async function main() {
  const docxPath = path.resolve(__dirname, '../cms/public/uploads/mock-tests/1751783713712-Sarkari_Parcha_CGL_26-Sept2023_Shift-1_English.docx')
  console.log('Testing DOCX upload with file:', docxPath)
  const buf = await readFile(docxPath)
  // @ts-ignore - Node 18+ has File
  const file = new File([buf], path.basename(docxPath), { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

  let category = await prisma.examCategory.findFirst()
  if (!category) {
    category = await prisma.examCategory.create({ data: { name: 'Testing', slug: slugify('Testing'), isActive: true } })
  }

  const testName = 'Test Upload ' + new Date().toISOString()
  console.log('Using category:', category.id, category.name)
  const res = await simpleWordProcessor.processDocxFile(file as any, testName, category.id)
  console.log('Result:', res)
}

main().catch((e) => {
  console.error('Script error:', e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
}) 
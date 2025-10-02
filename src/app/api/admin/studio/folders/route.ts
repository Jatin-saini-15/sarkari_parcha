import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^\-+/, '')
    .replace(/\-+$/, '')
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const folders = await prisma.folder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { mockTests: true } },
        children: {
          include: {
            _count: { select: { mockTests: true } }
          }
        }
      }
    });

    const formattedFolders = folders.map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      slug: folder.slug,
      description: folder.description,
      parentId: folder.parentId,
      testsCount: folder._count.mockTests,
      children: folder.children.map((child: any) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        testsCount: child._count.mockTests
      })),
      createdAt: folder.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, folders: formattedFolders });
  } catch (error) {
    console.error('[STUDIO-FOLDERS][GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, description, parentId } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const slug = slugify(name);
    
    // Check for duplicate slug
    const existingFolder = await prisma.folder.findFirst({
      where: { slug, parentId: parentId || null }
    });

    if (existingFolder) {
      return NextResponse.json({ error: 'Folder with this name already exists' }, { status: 400 });
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        parentId: parentId || null
      }
    });

    console.log('[STUDIO-FOLDERS][POST] Created folder:', folder.name);

    return NextResponse.json({ success: true, folder });
  } catch (error) {
    console.error('[STUDIO-FOLDERS][POST] Error:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}


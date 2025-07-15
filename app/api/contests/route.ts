import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contest from '@/models/Contest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUniqueSlug } from '@/lib/utils/slug';

export async function GET() {
  try {
    await dbConnect();
    
    const contests = await Contest.find({ activ: true })
      .sort({ dataDesfasurarii: 1 })
      .lean();
    
    return NextResponse.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea concursurilor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      );
    }

    // Toți utilizatorii autentificați pot crea concursuri
    console.log('🔍 Creating contest for user:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role || 'user'
    });
    
    await dbConnect();
    
    const data = await request.json();
    
    // Generăm slug-ul
    const slug = await createUniqueSlug(data.nume);
    
    const contest = new Contest({
      ...data,
      slug,
      organizatorId: session.user.id,
    });
    
    await contest.save();
    
    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    console.error('Error creating contest:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea concursului' },
      { status: 500 }
    );
  }
}

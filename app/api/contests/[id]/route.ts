import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contest from '@/models/Contest';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUniqueSlug } from '@/lib/utils/slug';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const contest = await Contest.findById(params.id).lean();
    
    if (!contest) {
      return NextResponse.json(
        { error: 'Concursul nu a fost găsit' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(contest);
  } catch (error) {
    console.error('Error fetching contest:', error);
    return NextResponse.json(
      { error: 'Eroare la încărcarea concursului' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 PUT Contest - Starting request for ID:', params.id);
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('❌ PUT Contest - No session or user ID');
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      );
    }

    console.log('🔍 PUT Contest - Session data:', {
      userId: session.user.id,
      userEmail: session.user.email,
      userRole: session.user.role,
      contestId: params.id
    });
    
    await dbConnect();
    console.log('✅ PUT Contest - Database connected');
    
    const contest = await Contest.findById(params.id);
    console.log('🔍 PUT Contest - Found contest:', {
      id: contest?._id,
      name: contest?.nume,
      organizatorId: contest?.organizatorId
    });
    
    if (!contest) {
      console.log('❌ PUT Contest - Contest not found');
      return NextResponse.json(
        { error: 'Concursul nu a fost găsit' },
        { status: 404 }
      );
    }
    
    // Verificăm utilizatorul direct din baza de date pentru rol
    const dbUser = await User.findById(session.user.id);
    const finalUserRole = dbUser?.role || session.user.role || 'user';
    
    console.log('🔍 PUT Contest - Permission check:', {
      sessionRole: session.user.role,
      dbRole: dbUser?.role,
      finalRole: finalUserRole,
      isAdmin: finalUserRole === 'admin',
      organizatorId: contest.organizatorId,
      currentUserId: session.user.id,
      isOwner: contest.organizatorId === session.user.id
    });
    
    // Administratorii pot edita orice concurs, alții doar pe ale lor
    if (finalUserRole !== 'admin' && contest.organizatorId !== session.user.id) {
      console.log('❌ PUT Contest - Permission denied');
      return NextResponse.json(
        { error: 'Nu aveți permisiunea să editați acest concurs' },
        { status: 403 }
      );
    }
    
    console.log('✅ PUT Contest - Permission granted');
    
    const data = await request.json();
    console.log('🔍 PUT Contest - Request data received');
    
    // Actualizăm slug-ul dacă s-au schimbat numele sau data
    if (data.nume !== contest.nume) {
      data.slug = await createUniqueSlug(data.nume, params.id);
      console.log('🔍 PUT Contest - Updated slug:', data.slug);
    }
    
    const updatedContest = await Contest.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    console.log('✅ PUT Contest - Contest updated successfully');
    return NextResponse.json(updatedContest);
  } catch (error) {
    console.error('❌ PUT Contest - Error updating contest:', error);
    return NextResponse.json(
      { error: 'Eroare la actualizarea concursului' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Autentificare necesară' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const contest = await Contest.findById(params.id);
    
    if (!contest) {
      return NextResponse.json(
        { error: 'Concursul nu a fost găsit' },
        { status: 404 }
      );
    }
    
    // Verificăm utilizatorul direct din baza de date pentru rol
    const dbUser = await User.findById(session.user.id);
    const finalUserRole = dbUser?.role || session.user.role || 'user';
    
    // Administratorii pot șterge orice concurs, alții doar pe ale lor
    if (finalUserRole !== 'admin' && contest.organizatorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Nu aveți permisiunea să ștergeți acest concurs' },
        { status: 403 }
      );
    }
    
    await Contest.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Concurs șters cu succes' });
  } catch (error) {
    console.error('Error deleting contest:', error);
    return NextResponse.json(
      { error: 'Eroare la ștergerea concursului' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { nume, email, password } = await request.json();

    if (!nume || !email || !password) {
      return NextResponse.json(
        { error: 'Toate câmpurile sunt obligatorii' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Parola trebuie să aibă cel puțin 6 caractere' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verificăm dacă email-ul există deja
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Există deja un cont cu acest email' },
        { status: 409 }
      );
    }

    // Hash parola
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creăm utilizatorul
    const user = new User({
      nume,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user', // Rol implicit pentru utilizatori noi
    });

    await user.save();

    return NextResponse.json(
      { message: 'Cont creat cu succes' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Eroare la crearea contului' },
      { status: 500 }
    );
  }
}

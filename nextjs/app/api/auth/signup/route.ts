import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users, addUser, userExists, UserRecord } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (userExists(email)) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (in a real app, save to database)
    const newUser: UserRecord = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    addUser(newUser);

    // Return success (don't include password in response)
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

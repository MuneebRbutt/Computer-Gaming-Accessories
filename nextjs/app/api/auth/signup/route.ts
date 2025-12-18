import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { UserService } from '@/lib/database';
import { z } from 'zod';

// Validation schema for signup
const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validationResult = signupSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
          message: errors[0].message
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists in MongoDB
    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (12 rounds for security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    // Generate unique username from email
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    let username = baseUsername;

    // Check if username exists and make it unique if needed
    try {
      let usernameExists = await UserService.getUserByUsername(username);
      let counter = 1;
      while (usernameExists) {
        username = `${baseUsername}${counter}`;
        usernameExists = await UserService.getUserByUsername(username);
        counter++;
        // Prevent infinite loop
        if (counter > 100) {
          username = `${baseUsername}_${Date.now()}`;
          break;
        }
      }
    } catch (error) {
      // If username check fails, use timestamp fallback
      username = `${baseUsername}_${Date.now()}`;
    }

    // Create user in MongoDB database
    let newUser;
    try {
      newUser = await UserService.createUser({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        username, // Use the unique username we generated above
        role: 'CUSTOMER', // Default role for new signups
        emailVerified: null,
        avatar: null,
        phone: null,
        newsletter: false
      });
    } catch (createError: any) {
      console.error('User creation error:', createError);

      // Handle Prisma/MongoDB specific errors
      if (createError.code === 'P2002' || createError.code === 11000) {
        // Unique constraint violation
        const field = createError.meta?.target?.[0] || 'email';
        return NextResponse.json(
          { error: `User already exists with this ${field}` },
          { status: 400 }
        );
      }

      // Re-throw to be caught by outer catch block
      throw createError;
    }

    console.log('New user registered:', { id: newUser.id, email: newUser.email, role: newUser.role });

    // Return success (don't include password in response)
    return NextResponse.json(
      {
        message: 'Account created successfully! You can now login.',
        user: {
          id: newUser.id,
          name: `${newUser.firstName}${newUser.lastName ? ' ' + newUser.lastName : ''}`,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      // MongoDB duplicate key error
      if (error.message.includes('Unique constraint') || error.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        );
      }

      // Prisma unique constraint error
      if (error.message.includes('Unique constraint') || error.message.includes('P2002')) {
        return NextResponse.json(
          { error: 'User already exists with this email or username' },
          { status: 400 }
        );
      }

      // Database connection error
      if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
        console.error('Database connection error:', error);
        return NextResponse.json(
          { error: 'Database connection failed. Please check your DATABASE_URL environment variable.' },
          { status: 500 }
        );
      }

      // Return the actual error message for debugging (in development)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          {
            error: 'Internal server error',
            message: error.message,
            stack: error.stack
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

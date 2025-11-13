import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const SKRYBIT_API_URL = 'https://api.skrybit.io';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const recipientAddress = formData.get('recipient_address') as string;
    const feeRate = formData.get('fee_rate') as string;
    const senderAddress = formData.get('sender_address') as string;

    // Validate required fields
    if (!file || !recipientAddress || !feeRate || !senderAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only jpg, png, gif, webp are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size (200kb - 400kb)
    const MIN_SIZE = 200 * 1024;
    const MAX_SIZE = 400 * 1024;
    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size must be between 200kb and 400kb. Current size: ${Math.round(file.size / 1024)}kb` },
        { status: 400 }
      );
    }

    // Create form data for Skrybit API
    const skrybitFormData = new FormData();
    skrybitFormData.append('file', file);
    skrybitFormData.append('recipient_address', recipientAddress);
    skrybitFormData.append('fee_rate', feeRate);
    skrybitFormData.append('sender_address', senderAddress);

    // Get JWT token from environment
    const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (!authToken) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing auth token' },
        { status: 500 }
      );
    }

    // Call Skrybit API
    const response = await axios.post(
      `${SKRYBIT_API_URL}/inscriptions/create-commit`,
      skrybitFormData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Validate the response data
    const { payment_address, required_amount_in_sats, inscription_id } = response.data;
    
    if (!payment_address || !required_amount_in_sats) {
      console.error('Invalid Skrybit API response:', response.data);
      return NextResponse.json(
        { error: 'Invalid response from inscription service' },
        { status: 500 }
      );
    }

    // Validate that required_amount_in_sats is a valid number
    const amountInSats = parseInt(required_amount_in_sats);
    if (isNaN(amountInSats) || amountInSats <= 0) {
      console.error('Invalid required_amount_in_sats:', required_amount_in_sats);
      return NextResponse.json(
        { error: 'Invalid inscription amount received from service' },
        { status: 500 }
      );
    }

    console.log('Inscription commit created successfully:', {
      payment_address,
      required_amount_in_sats,
      inscription_id
    });

    // Return the response from Skrybit
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        error: error.response?.data?.message || 'Failed to create inscription commit',
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}

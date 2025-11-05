import axios from 'axios';

export interface InscriptionResponse {
  payment_address: string;
  required_amount_in_sats: string;
  inscription_id: string;
}

export const createInscriptionCommit = async (
  file: File,
  recipientAddress: string,
  feeRate: number,
  senderAddress: string
): Promise<InscriptionResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient_address', recipientAddress);
    formData.append('fee_rate', feeRate.toString());
    formData.append('sender_address', senderAddress);

    const response = await axios.post<InscriptionResponse>(
      '/api/inscriptions/create-commit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to create inscription commit:', error);
    throw error;
  }
};

export const formatFileSize = (bytes: number): string => {
  const kb = bytes / 1024;
  return `${Math.round(kb)}kb`;
};

export const isFileSizeValid = (bytes: number): boolean => {
  const MIN_SIZE = 200 * 1024; // 200kb
  const MAX_SIZE = 400 * 1024; // 400kb
  return bytes >= MIN_SIZE && bytes <= MAX_SIZE;
};

import axios from "axios";

// API base URL - should be from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Define types for the payment request
export interface PaymentInitiateRequest {
  name: string;
  phone: string;
  amount: number;
  transactionId: string;
  email?: string;
  productInfo?: string;
}

interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse: {
      type: string;
      redirectInfo: {
        url: string;
        method: string;
      };
    };
  };
}

// Define types for payment status
export interface PaymentStatus {
  success: boolean;
  transactionId: string;
  amount: number;
  message: string;
}

/**
 * Initiates a payment request with the PhonePe API
 * @param paymentData - The payment data to be sent
 * @returns Promise with redirect URL or null if an error occurs
 */
export async function initiatePayment(
  paymentData: PaymentInitiateRequest
): Promise<string | null> {
  try {
    // Validate input data
    if (!paymentData.name || !paymentData.phone || !paymentData.amount || !paymentData.transactionId) {
      throw new Error("Missing required payment information");
    }

    // Format request data
    const requestData = {
      name: paymentData.name,
      amount: paymentData.amount,
      phone: paymentData.phone,
      transactionId: paymentData.transactionId,
      email: paymentData.email || "",
      productInfo: paymentData.productInfo || "Order Payment",
      MUID: `MUID${Date.now()}`, // Generate a unique merchant user ID
    };

    // Make API request
    const response = await axios.post<PhonePeResponse>(`${API_BASE_URL}/api/order`, requestData);

    // Validate response
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Payment initiation failed");
    }

    // Extract redirect URL
    const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!redirectUrl) {
      throw new Error("No redirect URL found in the response");
    }

    return redirectUrl;
  } catch (error) {
    console.error("Payment initiation error:", error);
    return null;
  }
}

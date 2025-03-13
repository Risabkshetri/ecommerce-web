import axios from "axios";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Environment variables with type safety
const SALT_KEY = process.env.NEXT_PUBLIC_SALT_KEY as string;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MARCHANT_ID as string;

// Define types for request and response data
interface PaymentRequestData {
  transactionId: string;
  name: string;
  amount: number;
  phone: string;
}

interface PhonePePayload {
  merchantId: string;
  merchantTransactionId: string;
  name: string;
  amount: number;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  mobileNumber: string;
  paymentInstrument: {
    type: string;
  };
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate environment variables
    if (!SALT_KEY || !MERCHANT_ID) {
      throw new Error("Missing required environment variables");
    }

    // Parse and validate request data
    const reqData: PaymentRequestData = await req.json();
    if (!reqData.transactionId || !reqData.name || !reqData.amount || !reqData.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { transactionId, name, amount, phone } = reqData;
    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://api.phonepe.com/apis/pg/v1/pay" 
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
    const callbackBaseUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "http://localhost:3000";

    // Create payload
    const payload: PhonePePayload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      name: name,
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
      redirectUrl: `${callbackBaseUrl}/api/status?id=${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `${callbackBaseUrl}/api/status?id=${transactionId}`,
      mobileNumber: phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Generate checksum
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
    const keyIndex = 1;
    const stringToHash = payloadBase64 + "/pg/v1/pay" + SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Make API request
    const response = await axios({
      method: "POST",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadBase64,
      },
    });

    // Log response (consider using a proper logging service in production)
    console.log("PhonePe API response:", response.data);

    return NextResponse.json(response.data);
  } catch (error) {
    // Better error handling
    console.error("PhonePe payment error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = axios.isAxiosError(error) && error.response?.status 
      ? (error.response.status as number)
      : 500;
    
    return NextResponse.json(
      { error: "Payment initiation failed", details: errorMessage },
      { status }
    );
  }
}
import crypto from "crypto";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Environment variables with type safety
const SALT_KEY = process.env.NEXT_PUBLIC_SALT_KEY as string;
const MERCHANT_ID = process.env.NEXT_PUBLIC_MARCHANT_ID as string;

// Define types for response data
interface PhonePeStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: string;
    responseCode: string;
    paymentInstrument: {
      type: string;
      pgTransactionId: string;
    };
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate environment variables
    if (!SALT_KEY || !MERCHANT_ID) {
      throw new Error("Missing required environment variables");
    }

    // Get transaction ID from URL parameters
    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");

    if (!merchantTransactionId) {
      return NextResponse.json(
        { error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    // Determine environment-specific configurations
    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://api.phonepe.com/apis/pg/v1/status"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
    const redirectBaseUrl = process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "https://localhost:3000";

    // Generate checksum
    const keyIndex = 1;
    const stringToHash = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}${SALT_KEY}`;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Make API request
    const response = await axios<PhonePeStatusResponse>({
      method: "GET",
      url: `${baseUrl}/${MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    });

    // Log response (consider using a proper logging service in production)
    console.log("PhonePe Status API response:", response.data);

    // Redirect based on payment status
    if (response.data.success === true) {
      return NextResponse.redirect(`${redirectBaseUrl}/success`, {
        status: 301,
      });
    } else {
      return NextResponse.redirect(`${redirectBaseUrl}/failed`, {
        status: 301,
      });
    }
  } catch (error) {
    // Better error handling
    console.error("PhonePe status check error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const status = axios.isAxiosError(error) && error.response?.status 
      ? error.response.status 
      : 500;
    
    return NextResponse.json(
      { error: "Payment status check failed", details: errorMessage },
      { status }
    );
  }
}
"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { initiatePayment } from "@/lib/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-toastify';

// Define types for component props
interface PaymentProps {
  defaultAmount?: string;
  orderId: string;
  onPaymentSuccess?: () => void;
}

// Define types for form data
interface PaymentFormData {
  name: string;
  phone: string;
  amount: string;
  email: string;
}

export default function Payment({
  defaultAmount = "",
  orderId,
  onPaymentSuccess
}: PaymentProps) {


  // State with proper typing
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    phone: "",
    amount: defaultAmount,
    email: ""
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes with proper typing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate unique transaction ID using the provided orderId
      const transactionId = `${orderId}-${Date.now()}`;

      // Parse amount as number for validation
      const amountValue = parseFloat(formData.amount);

      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
        throw new Error("Valid 10-digit phone number is required");
      }

      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Valid amount is required");
      }

      // Call the payment service
      const redirectUrl = await initiatePayment({
        name: formData.name,
        phone: formData.phone,
        amount: amountValue,
        transactionId,
        email: formData.email
      });

      // Redirect to payment page
      if (redirectUrl) {
        toast("Redirecting you to the payment gateway...", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Allow toast to show before redirect
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);

        // Call the success callback if provided
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast("Payment initiation failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="1"
              value={formData.amount}
              onChange={handleInputChange}
              required
              placeholder="0.00"
              disabled={!!defaultAmount}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Your payment is secure and encrypted</p>
            <div className="flex justify-center space-x-2 mt-2">
              {/* Security badges/icons could go here */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
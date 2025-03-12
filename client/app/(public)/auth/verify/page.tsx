'use client';

import { useVerifyEmail } from "@/hooks/use-auth";
import { useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react"; // Assuming you're using lucide-react

export default function VerifyPage() {
    const verifyEmailMutation = useVerifyEmail();
    
    useEffect(() => {
        // Check for token in query parameters first (new format)
        const urlParams = new URLSearchParams(window.location.search);
        const queryToken = urlParams.get('token');
        
        // Fallback to path parameter (old format) if query parameter is not present
        const pathToken = !queryToken ? window.location.pathname.split('/').pop() : null;
        
        const token = queryToken || pathToken;
        
        // Only attempt verification if we have a token and haven't already started the process
        if (token && !verifyEmailMutation.isPending && !verifyEmailMutation.isSuccess && !verifyEmailMutation.isError) {
            verifyEmailMutation.mutate(token);
        }
    }, [verifyEmailMutation.isPending, verifyEmailMutation.isSuccess, verifyEmailMutation.isError, verifyEmailMutation]);

    const getStatusContent = () => {
        if (verifyEmailMutation.isPending) {
            return {
                icon: <Loader2 className="h-12 w-12 animate-spin text-blue-500" />,
                message: "Verifying your email address...",
                className: "text-blue-600"
            };
        }
        if (verifyEmailMutation.isError) {
            return {
                icon: <XCircle className="h-12 w-12 text-red-500" />,
                message: verifyEmailMutation.error || "Verification failed. Please try again.",
                className: "text-red-600"
            };
        }
        if (verifyEmailMutation.isSuccess) {
            return {
                icon: <CheckCircle className="h-12 w-12 text-green-500" />,
                message: "Email verified successfully!",
                className: "text-green-600"
            };
        }
        return {
            icon: <Loader2 className="h-12 w-12 animate-spin text-blue-500" />,
            message: "Initializing verification...",
            className: "text-blue-600"
        };
    };

    const { icon, message, className } = getStatusContent();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Email Verification</h2>
                    <div className="flex flex-col items-center gap-4">
                        {icon}
                        <p className={`text-lg ${className}`}>
                            {message}
                        </p>
                    </div>
                    {verifyEmailMutation.isError && (
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 transition-colors"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

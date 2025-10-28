"use client";

import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    name: "Felipe Troncoso",
    handle: "@felipetroncoso",
    text: "Hunt ha sido un canal de ventas increible para todas las personas que quieren disfrutar de los eventos."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    name: "María González",
    handle: "@mariag",
    text: "La mejor plataforma para comprar tickets. Rápida, segura y confiable."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    name: "Ana Martínez",
    handle: "@anamtz",
    text: "Excelente experiencia. El proceso de compra es súper intuitivo y seguro."
  },
];

const translateError = (errorMessage: string): string => {
  // Rate limiting error
  if (errorMessage.includes("For security purposes")) {
    const match = errorMessage.match(/after (\d+) seconds/);
    const seconds = match ? match[1] : "unos";
    return `Por seguridad, puedes solicitar esto después de ${seconds} segundos.`;
  }

  // Other common errors
  if (errorMessage.includes("Invalid login credentials")) {
    return "Credenciales de inicio de sesión inválidas";
  }
  if (errorMessage.includes("Email not confirmed")) {
    return "Correo electrónico no confirmado";
  }
  if (errorMessage.includes("User already registered")) {
    return "Usuario ya registrado";
  }

  return errorMessage;
};

export const AuthSignIn = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errorCountdown, setErrorCountdown] = useState<number | null>(null);

  // Dynamic error countdown
  useEffect(() => {
    if (errorCountdown !== null && errorCountdown > 0) {
      const timer = setInterval(() => {
        setErrorCountdown((prev) => {
          if (prev === null || prev <= 1) {
            setError(null);
            return null;
          }
          setError(`Por seguridad, puedes solicitar esto después de ${prev - 1} segundos.`);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [errorCountdown]);

  const handleSendOtp = async (email: string) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setErrorCountdown(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setIsOtpSent(true);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Ocurrió un error";

      // Check if it's a rate limiting error
      if (errorMsg.includes("For security purposes")) {
        const match = errorMsg.match(/after (\d+) seconds/);
        if (match) {
          const seconds = parseInt(match[1], 10);
          setErrorCountdown(seconds);
          setError(`Por seguridad, puedes solicitar esto después de ${seconds} segundos.`);
        } else {
          setError(translateError(errorMsg));
        }
      } else {
        setError(translateError(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setErrorCountdown(null);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (error) throw error;
      if (session) {
        window.location.href = "/";
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Código inválido";

      // Check if it's a rate limiting error
      if (errorMsg.includes("For security purposes")) {
        const match = errorMsg.match(/after (\d+) seconds/);
        if (match) {
          const seconds = parseInt(match[1], 10);
          setErrorCountdown(seconds);
          setError(`Por seguridad, puedes solicitar esto después de ${seconds} segundos.`);
        } else {
          setError(translateError(errorMsg));
        }
      } else {
        setError(translateError(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    setErrorCountdown(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Error al iniciar sesión con Google";

      // Check if it's a rate limiting error
      if (errorMsg.includes("For security purposes")) {
        const match = errorMsg.match(/after (\d+) seconds/);
        if (match) {
          const seconds = parseInt(match[1], 10);
          setErrorCountdown(seconds);
          setError(`Por seguridad, puedes solicitar esto después de ${seconds} segundos.`);
        } else {
          setError(translateError(errorMsg));
        }
      } else {
        setError(translateError(errorMsg));
      }
    }
  };

  const handleResendOtp = async (email: string) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setErrorCountdown(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Ocurrió un error";

      // Check if it's a rate limiting error
      if (errorMsg.includes("For security purposes")) {
        const match = errorMsg.match(/after (\d+) seconds/);
        if (match) {
          const seconds = parseInt(match[1], 10);
          setErrorCountdown(seconds);
          setError(`Por seguridad, puedes solicitar esto después de ${seconds} segundos.`);
        } else {
          setError(translateError(errorMsg));
        }
      } else {
        setError(translateError(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    window.location.href = "/sign-up";
  };

  return (
    <SignInPage
      title={
        <span className="font-semibold text-foreground tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          Time to Hunt
        </span>
      }
      description={
        isOtpSent
          ? "Hemos enviado un código de 6 dígitos a tu correo electrónico"
          : "Accede a tu cuenta y descubre los mejores eventos"
      }
      heroImageSrc="animated" // Flag to show right section with animated background
      testimonials={sampleTestimonials}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onResendOtp={handleResendOtp}
      onCreateAccount={handleCreateAccount}
      isOtpSent={isOtpSent}
      isLoading={isLoading}
      error={error}
      message={message}
    />
  );
};

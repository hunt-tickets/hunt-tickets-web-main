"use client";

import { SignUpPage, Testimonial, SignUpFormData } from "@/components/ui/sign-up";
import { supabaseClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    name: "María González",
    handle: "@mariag",
    text: "La mejor plataforma para comprar tickets. Rápida, segura y confiable."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    name: "Carlos Rodríguez",
    handle: "@carlosr",
    text: "Me encanta lo fácil que es encontrar y comprar entradas para mis eventos favoritos."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    name: "Ana Martínez",
    handle: "@anamtz",
    text: "Excelente experiencia. El proceso de compra es súper intuitivo y seguro."
  },
];

export const AuthSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a temporary password or use email OTP
      const { error: signUpError } = await supabaseClient.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
          data: {
            nombre: data.nombre,
            apellido: data.apellido,
            prefijo: data.prefijo,
            telefono: data.telefono,
            birthday: data.birthday,
            tipo_documento: data.tipoDocumento,
            numero_documento: data.numeroDocumento,
            full_name: `${data.nombre} ${data.apellido}`,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Redirect to success page
      router.push("/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <SignUpPage
      title={
        <span className="font-semibold text-foreground tracking-tight" style={{ fontFamily: 'LOT, sans-serif' }}>
          Join the Hunt
        </span>
      }
      description="Crea tu cuenta y comienza a descubrir eventos increíbles"
      heroImageSrc="animated"
      testimonials={sampleTestimonials}
      onSignUp={handleSignUp}
      onLogin={handleLogin}
      isLoading={isLoading}
      error={error}
    />
  );
};

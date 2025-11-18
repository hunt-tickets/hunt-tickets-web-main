"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Mail, CheckCircle } from "lucide-react";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog that shows when unauthenticated users try to purchase tickets
 *
 * Two tabs:
 * 1. Login - For existing users (email OTP)
 * 2. Signup - For new users (email OTP with auto-account creation)
 *
 * Both use the same OTP flow:
 * - User enters email → receives OTP code via email
 * - User enters OTP code → gets authenticated
 *
 * After successful auth, dialog closes and user can proceed with purchase
 * Auth state automatically syncs via Supabase onAuthStateChange subscription
 */
export function AuthRequiredDialog({
  open,
  onOpenChange,
}: AuthRequiredDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Login tab state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);

  // Signup tab state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

  /**
   * Send OTP for login
   * Does NOT create new users (shouldCreateUser: false)
   */
  const handleLoginSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: loginEmail,
        options: {
          shouldCreateUser: false, // Only login existing users
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setLoginOtpSent(true);
    } catch {
      setError("Error al enviar el código. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle signup with password
   * Creates new user account with email/password
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    // Validate passwords match
    if (signupPassword !== signupRepeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (signupPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Success - close dialog
      onOpenChange(false);
      resetForms();
    } catch {
      setError("Error al crear la cuenta. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP for login
   */
  const handleLoginVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.verifyOtp({
        email: loginEmail,
        token: loginOtp,
        type: "email",
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (session) {
        // Success - close dialog and reset
        onOpenChange(false);
        resetForms();
      }
    } catch {
      setError("Código inválido. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };


  /**
   * Reset all form fields
   */
  const resetForms = () => {
    setLoginEmail("");
    setLoginOtp("");
    setLoginOtpSent(false);
    setSignupEmail("");
    setSignupPassword("");
    setSignupRepeatPassword("");
    setError(null);
    setMessage(null);
  };

  /**
   * Handle dialog close - reset everything
   */
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForms();
      setActiveTab("login");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {activeTab === "login"
              ? loginOtpSent
                ? "Verifica tu correo"
                : "Inicia sesión para continuar"
              : "Crea tu cuenta"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base pt-2">
            {loginOtpSent && activeTab === "login"
              ? "Ingresa el código que enviamos a tu correo"
              : activeTab === "login"
              ? "Para comprar tickets necesitas iniciar sesión. Ingresa tu correo para recibir un código de acceso."
              : "Para comprar tickets necesitas una cuenta. Crea tu cuenta para continuar con la compra."}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "login" | "signup");
            setError(null);
            setMessage(null);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 pt-4">
            {!loginOtpSent ? (
              // Step 1: Email input
              <form onSubmit={handleLoginSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo electrónico</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar código
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // Step 2: OTP verification
              <form onSubmit={handleLoginVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email-display">
                    Correo electrónico
                  </Label>
                  <Input
                    id="login-email-display"
                    type="email"
                    value={loginEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-otp">Código de verificación</Label>
                  <Input
                    id="login-otp"
                    type="text"
                    placeholder="000000"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    required
                    disabled={isLoading}
                    maxLength={6}
                    autoFocus
                    className="text-center text-lg tracking-widest"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || loginOtp.length !== 6}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      "Verificar código"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setLoginOtpSent(false);
                      setLoginOtp("");
                      setError(null);
                      setMessage(null);
                    }}
                    disabled={isLoading}
                  >
                    Usar otro correo
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4 pt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Correo electrónico</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-repeat-password">
                  Repetir contraseña
                </Label>
                <Input
                  id="signup-repeat-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupRepeatPassword}
                  onChange={(e) => setSignupRepeatPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

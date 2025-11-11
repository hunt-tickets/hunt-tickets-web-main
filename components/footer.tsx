"use client";

import Link from "next/link";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {

  return (
    <footer className="w-full border-t dark:border-t-[#303030] bg-white dark:bg-[#101010] pb-[68px] md:pb-0 relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center">
              <span className="text-2xl font-bold tracking-tight transition-all duration-300 ease-out hover:tracking-wide inline-block" style={{ fontFamily: 'LOT, sans-serif' }}>
                HUNT
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu plataforma de tickets para eventos
            </p>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">HUNT</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/sobre-nosotros"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/573228597640"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  href="https://zaap.bio/hunt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Descarga la app
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/resources/terms-and-conditions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/terms-and-conditions"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="https://forms.hunt-tickets.com/refunds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reembolsos
                </Link>
              </li>
              <li>
                <Link
                  href="https://forms.hunt-tickets.com/feedbacks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Danos retroalimentación
                </Link>
              </li>
              <li>
                <Link
                  href="https://forms.hunt-tickets.com/bugs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reportar un bug
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Síguenos</h3>
            <div className="flex gap-2">
              <Link
                href="https://www.instagram.com/hunt____tickets/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/company/hunt-tickets-co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link
                href="https://wa.me/573228597640"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">WhatsApp</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t dark:border-t-[#303030] pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hunt Tickets. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };

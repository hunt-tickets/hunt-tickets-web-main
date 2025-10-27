"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sections = [
  { id: "section-1", title: "1. Identificación del responsable" },
  { id: "section-2", title: "2. Objeto de la plataforma" },
  { id: "section-3", title: "3. Aceptación del usuario" },
  { id: "section-4", title: "4. Tratamiento de datos personales" },
  { id: "section-5", title: "5. Propiedad intelectual" },
  { id: "section-6", title: "6. Cuentas y seguridad" },
  { id: "section-7", title: "7. Limitación de responsabilidad" },
  { id: "section-8", title: "8. Modificaciones de los términos" },
  { id: "section-9", title: "9. Política de devoluciones y cambios" },
  { id: "section-10", title: "10. Jurisdicción y legislación aplicable" },
  { id: "section-11", title: "11. Contacto y canales de atención" },
  { id: "section-12", title: "12. Aceptación final" },
];

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState<string>("section-1");
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const TableOfContents = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={mobile ? "" : ""}>
      {!mobile && (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Tabla de Contenido
        </h3>
      )}
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left text-sm transition-colors w-full py-1.5 px-3 rounded-md ${
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-left">
                    Tabla de Contenido
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto">
                  <TableOfContents mobile />
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-lg font-bold md:text-xl">Hunt Tickets</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Términos y Condiciones
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 xl:gap-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto py-8">
          <TableOfContents />
        </aside>

        {/* Main content */}
        <main className="py-8 lg:py-12 max-w-3xl">
          {/* Hero section */}
          <div className="mb-12 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">
              Términos y condiciones de uso
            </h1>
            <p className="text-xl text-muted-foreground">Hunt Tickets</p>
            <p className="text-sm text-muted-foreground">
              Fecha de entrada en vigencia: 03 de abril de 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
            <p className="text-base leading-relaxed">
              Bienvenido a Hunt Tickets S.A.S. (&ldquo;HUNT&rdquo;,
              &ldquo;nosotros&rdquo; o &ldquo;la empresa&rdquo;), una plataforma
              tecnológica que permite descubrir, comprar, gestionar y transferir
              entradas a eventos, a través de nuestra aplicación móvil, página
              web y canales habilitados como WhatsApp. Al registrarse, acceder o
              utilizar nuestros servicios, usted (el &ldquo;Usuario&rdquo;)
              acepta plenamente estos Términos y Condiciones de Uso. Le
              recomendamos leerlos cuidadosamente. Si no está de acuerdo, le
              solicitamos abstenerse de usar la plataforma.
            </p>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              1. Identificación del responsable
            </h2>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                <strong>Razón social:</strong> Hunt Tickets S.A.S.
              </p>
              <p>
                <strong>NIT:</strong> 901881747
              </p>
              <p>
                <strong>Domicilio:</strong> Calle 94 #9-44, Bogotá D.C.,
                Colombia
              </p>
              <p>
                <strong>Correo de contacto:</strong> info@hunt-tickets.com
              </p>
              <p>
                <strong>WhatsApp oficial:</strong> +57 322 8597640
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              2. Objeto de la plataforma
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p className="font-semibold">
                HUNT es una solución tecnológica para la comercialización de
                entradas a eventos públicos y privados. A través de nuestra
                plataforma, los usuarios pueden:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comprar boletos de eventos.</li>
                <li>Recibir entradas en formato digital.</li>
                <li>Transferir entradas a otros usuarios.</li>
                <li>
                  Recibir notificaciones, promociones o recordatorios
                  personalizados.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              3. Aceptación del usuario
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>Al utilizar HUNT, el Usuario:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Declara que es mayor de edad y tiene capacidad legal para
                  contratar.
                </li>
                <li>
                  Acepta que la información proporcionada es veraz y
                  actualizada.
                </li>
                <li>
                  Se obliga a utilizar la plataforma de forma lícita y conforme
                  a estos términos.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              4. Tratamiento de datos personales
            </h2>
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  4.1 Consentimiento informado
                </h3>
                <p>
                  Al registrarse en HUNT, usted autoriza de manera previa,
                  expresa e informada a Hunt Tickets S.A.S. para recolectar,
                  almacenar, usar, circular, analizar, transmitir, y
                  eventualmente compartir sus datos personales conforme a la Ley
                  1581 de 2012 y demás normas vigentes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  4.2 Datos recolectados
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre completo, cédula o documento de identidad</li>
                  <li>Número de teléfono y dirección de correo electrónico</li>
                  <li>Fecha de nacimiento, género, ciudad de residencia</li>
                  <li>Preferencias, eventos comprados o visualizados</li>
                  <li>Información de dispositivos, IP, ubicación aproximada</li>
                  <li>
                    Métodos de pago, transacciones y comportamiento de compra
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  4.3 Finalidades del tratamiento
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Brindar los servicios contratados</li>
                  <li>
                    Mejorar la experiencia de usuario con algoritmos
                    personalizados
                  </li>
                  <li>Detectar usos indebidos o fraudes</li>
                  <li>
                    Enviar comunicaciones sobre su cuenta, eventos o promociones
                  </li>
                  <li>
                    Hacer análisis de datos agregados para toma de decisiones de
                    negocio
                  </li>
                  <li>
                    Compartir información con aliados estratégicos y proveedores
                    tecnológicos, bajo acuerdos de confidencialidad y protección
                    de datos.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  4.4 Uso amplio de la data
                </h3>
                <p className="mb-3">
                  HUNT se reserva el derecho a utilizar la información
                  recolectada para fines comerciales, estadísticos, de análisis,
                  entrenamiento de modelos de inteligencia artificial,
                  predicción de comportamiento de compra, publicidad
                  personalizada y mejoras de producto, siempre respetando los
                  principios de legalidad, finalidad, libertad, seguridad,
                  veracidad y acceso.
                </p>
                <p>
                  En ningún caso compartiremos su información con terceros sin
                  autorización, salvo por mandato legal o contractual necesario
                  para prestar el servicio.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              5. Propiedad intelectual
            </h2>
            <p className="text-base leading-relaxed">
              Todos los contenidos, desarrollos, algoritmos, marcas, diseños,
              interfaces y códigos fuente usados o desarrollados por HUNT son
              propiedad exclusiva de Hunt Tickets S.A.S. Queda prohibida su
              copia, reproducción, modificación o comercialización sin
              autorización previa por escrito.
            </p>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              6. Cuentas y seguridad
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-base leading-relaxed">
              <li>
                El Usuario es responsable de mantener la confidencialidad de su
                cuenta y credenciales.
              </li>
              <li>
                En caso de uso indebido o sospecha de fraude, HUNT podrá
                suspender o eliminar la cuenta.
              </li>
              <li>
                Cualquier actividad desde su cuenta se presume hecha por usted.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              7. Limitación de responsabilidad
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>HUNT no se hace responsable por:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Cancelaciones, modificaciones o fallas en eventos por parte de
                  organizadores.
                </li>
                <li>
                  Daños o perjuicios derivados del mal uso de la plataforma por
                  parte del usuario.
                </li>
                <li>
                  Fallas técnicas, interrupciones del servicio, pérdida de
                  información por causas ajenas.
                </li>
              </ul>
              <p className="font-semibold">
                El uso de la plataforma es bajo su propio riesgo.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              8. Modificaciones de los términos
            </h2>
            <p className="text-base leading-relaxed">
              Nos reservamos el derecho a modificar estos Términos y Condiciones
              en cualquier momento. La versión actualizada estará disponible en
              nuestros canales y se entiende aceptada al continuar usando la
              plataforma.
            </p>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              9. Política de devoluciones y cambios
            </h2>
            <p className="text-base leading-relaxed">
              Las entradas adquiridas a través de HUNT no son reembolsables,
              salvo que el evento sea cancelado y el organizador autorice la
              devolución. En tales casos, se aplicarán políticas específicas de
              reembolso y tiempos de procesamiento, que serán comunicadas
              oportunamente.
            </p>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              10. Jurisdicción y legislación aplicable
            </h2>
            <p className="text-base leading-relaxed">
              Este contrato se rige por las leyes de la República de Colombia.
              Cualquier conflicto será resuelto ante la jurisdicción ordinaria
              de la ciudad de Bogotá D.C.
            </p>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              11. Contacto y canales de atención
            </h2>
            <div className="space-y-3 text-base leading-relaxed">
              <p>
                <strong>Correo electrónico:</strong> info@hunt-tickets.com
              </p>
              <p>
                <strong>WhatsApp:</strong> +57 322 8597640
              </p>
              <p>
                <strong>Dirección física:</strong> Calle 94 #9-44, Bogotá D.C.,
                Colombia
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-16 scroll-mt-20">
            <h2 className="text-2xl font-bold mb-6 text-balance">
              12. Aceptación final
            </h2>
            <p className="text-base leading-relaxed">
              Al continuar con el uso de HUNT, usted manifiesta haber leído,
              comprendido y aceptado estos Términos y Condiciones de forma
              libre, voluntaria y expresa.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

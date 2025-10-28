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
      const offset = 100;
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
      const scrollPosition = window.scrollY + 120;

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
    <nav className={mobile ? "" : "bg-background/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"} style={mobile ? {} : { border: '1px solid #303030' }}>
      {!mobile && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Tabla de Contenido
        </h3>
      )}
      <ul className="space-y-1.5">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left text-sm transition-all w-full py-2.5 px-4 rounded-lg ${
                activeSection === section.id
                  ? "bg-[#303030]/20 text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={activeSection === section.id ? { border: '1px solid #303030' } : {}}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
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
              <h1 className="text-base font-bold">Hunt Tickets</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Términos y Condiciones
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 lg:grid lg:grid-cols-[300px_1fr] lg:gap-12 xl:gap-16 py-8 lg:py-12">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TableOfContents />
        </aside>

        {/* Main content */}
        <main className="max-w-4xl">
          {/* Hero section */}
          <div className="mb-16 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                Términos y condiciones de uso
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-medium">
                Hunt Tickets
              </p>
            </div>
            <div className="inline-block px-4 py-2 rounded-full bg-muted/50" style={{ border: '1px solid #303030' }}>
              <p className="text-sm text-muted-foreground">
                Fecha de entrada en vigencia: <span className="font-semibold text-foreground">03 de abril de 2025</span>
              </p>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-20">
            <div className="rounded-2xl border border-border bg-muted/30 p-8 lg:p-10">
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
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
          </div>

          {/* Section 1 */}
          <section id="section-1" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              1. Identificación del responsable
            </h2>
            <div className="space-y-4 text-base sm:text-lg leading-relaxed">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">Razón social</p>
                  <p className="font-semibold text-foreground">Hunt Tickets S.A.S.</p>
                </div>
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">NIT</p>
                  <p className="font-semibold text-foreground">901881747</p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border sm:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Domicilio</p>
                  <p className="font-semibold text-foreground">Calle 94 #9-44, Bogotá D.C., Colombia</p>
                </div>
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">Correo de contacto</p>
                  <p className="font-semibold text-foreground">info@hunt-tickets.com</p>
                </div>
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp oficial</p>
                  <p className="font-semibold text-foreground">+57 322 8597640</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              2. Objeto de la plataforma
            </h2>
            <div className="space-y-6 text-base sm:text-lg leading-relaxed">
              <p className="font-medium text-foreground">
                HUNT es una solución tecnológica para la comercialización de
                entradas a eventos públicos y privados. A través de nuestra
                plataforma, los usuarios pueden:
              </p>
              <ul className="space-y-3">
                {[
                  "Comprar boletos de eventos.",
                  "Recibir entradas en formato digital.",
                  "Transferir entradas a otros usuarios.",
                  "Recibir notificaciones, promociones o recordatorios personalizados."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                    <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              3. Aceptación del usuario
            </h2>
            <div className="space-y-6 text-base sm:text-lg leading-relaxed">
              <p className="font-medium text-foreground">Al utilizar HUNT, el Usuario:</p>
              <ul className="space-y-3">
                {[
                  "Declara que es mayor de edad y tiene capacidad legal para contratar.",
                  "Acepta que la información proporcionada es veraz y actualizada.",
                  "Se obliga a utilizar la plataforma de forma lícita y conforme a estos términos."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                    <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              4. Tratamiento de datos personales
            </h2>
            <div className="space-y-8 text-base sm:text-lg leading-relaxed">
              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                  4.1 Consentimiento informado
                </h3>
                <p className="text-muted-foreground">
                  Al registrarse en HUNT, usted autoriza de manera previa,
                  expresa e informada a Hunt Tickets S.A.S. para recolectar,
                  almacenar, usar, circular, analizar, transmitir, y
                  eventualmente compartir sus datos personales conforme a la Ley
                  1581 de 2012 y demás normas vigentes.
                </p>
              </div>

              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 text-foreground">
                  4.2 Datos recolectados
                </h3>
                <ul className="space-y-3">
                  {[
                    "Nombre completo, cédula o documento de identidad",
                    "Número de teléfono y dirección de correo electrónico",
                    "Fecha de nacimiento, género, ciudad de residencia",
                    "Preferencias, eventos comprados o visualizados",
                    "Información de dispositivos, IP, ubicación aproximada",
                    "Métodos de pago, transacciones y comportamiento de compra"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-6 text-foreground">
                  4.3 Finalidades del tratamiento
                </h3>
                <ul className="space-y-3">
                  {[
                    "Brindar los servicios contratados",
                    "Mejorar la experiencia de usuario con algoritmos personalizados",
                    "Detectar usos indebidos o fraudes",
                    "Enviar comunicaciones sobre su cuenta, eventos o promociones",
                    "Hacer análisis de datos agregados para toma de decisiones de negocio",
                    "Compartir información con aliados estratégicos y proveedores tecnológicos, bajo acuerdos de confidencialidad y protección de datos."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#303030]/10 p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                  4.4 Uso amplio de la data
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
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
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              5. Propiedad intelectual
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Todos los contenidos, desarrollos, algoritmos, marcas, diseños,
                interfaces y códigos fuente usados o desarrollados por HUNT son
                propiedad exclusiva de Hunt Tickets S.A.S. Queda prohibida su
                copia, reproducción, modificación o comercialización sin
                autorización previa por escrito.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              6. Cuentas y seguridad
            </h2>
            <ul className="space-y-3">
              {[
                "El Usuario es responsable de mantener la confidencialidad de su cuenta y credenciales.",
                "En caso de uso indebido o sospecha de fraude, HUNT podrá suspender o eliminar la cuenta.",
                "Cualquier actividad desde su cuenta se presume hecha por usted."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-5 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-base sm:text-lg text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              7. Limitación de responsabilidad
            </h2>
            <div className="space-y-6 text-base sm:text-lg leading-relaxed">
              <p className="font-medium text-foreground">HUNT no se hace responsable por:</p>
              <ul className="space-y-3">
                {[
                  "Cancelaciones, modificaciones o fallas en eventos por parte de organizadores.",
                  "Daños o perjuicios derivados del mal uso de la plataforma por parte del usuario.",
                  "Fallas técnicas, interrupciones del servicio, pérdida de información por causas ajenas."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-5 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                    <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-[#303030]/10 p-6" style={{ border: '1px solid #303030' }}>
                <p className="font-semibold text-foreground">
                  El uso de la plataforma es bajo su propio riesgo.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              8. Modificaciones de los términos
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Nos reservamos el derecho a modificar estos Términos y Condiciones
                en cualquier momento. La versión actualizada estará disponible en
                nuestros canales y se entiende aceptada al continuar usando la
                plataforma.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              9. Política de devoluciones y cambios
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Las entradas adquiridas a través de HUNT no son reembolsables,
                salvo que el evento sea cancelado y el organizador autorice la
                devolución. En tales casos, se aplicarán políticas específicas de
                reembolso y tiempos de procesamiento, que serán comunicadas
                oportunamente.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              10. Jurisdicción y legislación aplicable
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Este contrato se rige por las leyes de la República de Colombia.
                Cualquier conflicto será resuelto ante la jurisdicción ordinaria
                de la ciudad de Bogotá D.C.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              11. Contacto y canales de atención
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">Correo electrónico</p>
                <p className="font-semibold text-primary">info@hunt-tickets.com</p>
              </div>
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">WhatsApp</p>
                <p className="font-semibold text-primary">+57 322 8597640</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border sm:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Dirección física</p>
                <p className="font-semibold text-foreground">Calle 94 #9-44, Bogotá D.C., Colombia</p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              12. Aceptación final
            </h2>
            <div className="rounded-2xl bg-[#303030]/10 p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
                Al continuar con el uso de HUNT, usted manifiesta haber leído,
                comprendido y aceptado estos Términos y Condiciones de forma
                libre, voluntaria y expresa.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

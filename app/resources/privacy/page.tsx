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
  { id: "section-1", title: "1. Identificación del Responsable" },
  { id: "section-2", title: "2. Definiciones Relevantes" },
  { id: "section-3", title: "3. Datos que Recolectamos" },
  { id: "section-4", title: "4. Finalidades del Tratamiento" },
  { id: "section-5", title: "5. Tratamiento de Datos Sensibles" },
  { id: "section-6", title: "6. Derechos del Titular" },
  { id: "section-7", title: "7. Medidas de Seguridad" },
  { id: "section-8", title: "8. Transferencia Internacional" },
  { id: "section-9", title: "9. Tiempo de Conservación" },
  { id: "section-10", title: "10. Modificaciones a la Política" },
  { id: "section-11", title: "11. Procedimiento para Ejercer Derechos" },
  { id: "section-12", title: "12. Ley Aplicable y Jurisdicción" },
  { id: "section-13", title: "13. Aceptación" },
];

export default function PrivacyPage() {
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
                Política de Privacidad
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
                Política de Privacidad
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
            <div className="rounded-2xl bg-muted/30 p-8 lg:p-10" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg leading-relaxed text-foreground">
                Hunt Tickets S.A.S., en adelante &ldquo;HUNT&rdquo;, reconoce la importancia de
                proteger la privacidad de los datos personales de sus usuarios, y se
                compromete con el tratamiento adecuado, responsable y seguro de la
                información recolectada a través de sus plataformas tecnológicas,
                conforme a la legislación colombiana vigente.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section id="section-1" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              1. Identificación del Responsable
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
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">Domicilio</p>
                  <p className="font-semibold text-foreground">Calle 94 #9-44, Bogotá D.C., Colombia</p>
                </div>
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">Correo</p>
                  <p className="font-semibold text-foreground">info@hunt-tickets.com</p>
                </div>
                <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <p className="font-semibold text-foreground">+57 322 8597640</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              2. Definiciones Relevantes
            </h2>
            <div className="space-y-3">
              {[
                { term: "Dato personal", def: "Información que permite identificar a una persona." },
                { term: "Titular", def: "Persona natural dueña de los datos personales." },
                { term: "Tratamiento", def: "Recolección, almacenamiento, uso, circulación o supresión." },
                { term: "Encargado", def: "Persona o entidad que trata datos por cuenta del responsable." },
                { term: "Autorización", def: "Consentimiento previo, expreso e informado del titular." },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                  <p className="text-base text-foreground">
                    <span className="font-semibold">{item.term}:</span>{" "}
                    <span className="text-muted-foreground">{item.def}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              3. Datos que Recolectamos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Identificación", desc: "nombre, documento, fecha de nacimiento, género" },
                { title: "Contacto", desc: "correo electrónico, celular, ciudad" },
                { title: "Comportamiento", desc: "eventos visualizados, favoritos, compras" },
                { title: "Técnicos", desc: "IP, dispositivo, navegador, sistema operativo" },
                { title: "Transaccionales", desc: "medios de pago, frecuencia, valor de compra" },
                { title: "Sensibles", desc: "ubicación, intereses culturales o musicales" },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-muted/50" style={{ border: '1px solid #303030' }}>
                  <p className="font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              4. Finalidades del Tratamiento
            </h2>
            <div className="space-y-8">
              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                  4.1 Finalidades operativas
                </h3>
                <ul className="space-y-3">
                  {[
                    "Crear y gestionar su cuenta",
                    "Procesar compras de entradas",
                    "Enviar boletos y recordatorios",
                    "Acceso y registro a eventos",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                  4.2 Finalidades analíticas y comerciales
                </h3>
                <ul className="space-y-3">
                  {[
                    "Analizar comportamiento y consumo",
                    "Personalizar recomendaciones",
                    "Mejorar algoritmos y experiencia",
                    "Estudios de mercado internos",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                  4.3 Publicidad y monetización
                </h3>
                <ul className="space-y-3">
                  {[
                    "Promociones personalizadas",
                    "Beneficios o cupones según perfil",
                    "Compartir información con aliados estratégicos bajo confidencialidad para marketing y desarrollo",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#303030]/10 p-6" style={{ border: '1px solid #303030' }}>
                <p className="text-sm sm:text-base text-foreground">
                  <span className="font-semibold">Nota importante:</span> Nunca venderemos datos personales sin autorización expresa.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              5. Tratamiento de Datos Sensibles y de Menores
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8 space-y-4" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                No es obligatorio suministrar datos sensibles.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Se presume que los menores tienen consentimiento de su representante legal.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              6. Derechos del Titular
            </h2>
            <p className="text-muted-foreground mb-6 text-base sm:text-lg">
              Conforme a la Ley 1581 de 2012, el titular puede:
            </p>
            <div className="rounded-2xl bg-card p-6 lg:p-8 space-y-3" style={{ border: '1px solid #303030' }}>
              {[
                "Conocer, actualizar y rectificar sus datos.",
                "Solicitar prueba de la autorización.",
                "Ser informado sobre el uso de sus datos.",
                "Revocar autorización o solicitar supresión.",
                "Acceder gratuitamente a su información.",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#303030] mt-2 flex-shrink-0" />
                  <p className="text-base text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              7. Medidas de Seguridad
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                HUNT implementa medidas técnicas, humanas y administrativas para
                proteger la información contra pérdidas, accesos no autorizados, o
                usos indebidos.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              8. Transferencia Internacional de Datos
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Si se transfieren datos a otros países, se garantizará un nivel de
                protección equivalente al colombiano.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              9. Tiempo de Conservación de Datos
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Los datos serán conservados el tiempo necesario para cumplir las
                finalidades, luego se eliminarán o anonimizarán según la ley.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              10. Modificaciones a la Política de Privacidad
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Esta política puede cambiar. Los cambios serán informados en
                nuestros canales. Su uso continuo implica aceptación de las
                modificaciones.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              11. Procedimiento para Ejercer sus Derechos
            </h2>
            <p className="text-muted-foreground mb-6 text-base sm:text-lg">
              Puede ejercer sus derechos escribiendo a:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">Correo electrónico</p>
                <p className="font-semibold text-foreground">info@hunt-tickets.com</p>
              </div>
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">WhatsApp</p>
                <p className="font-semibold text-foreground">+57 322 8597640</p>
              </div>
              <div className="p-6 rounded-xl bg-card sm:col-span-2" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">Asunto</p>
                <p className="font-semibold text-foreground">&ldquo;Protección de Datos – [Nombre completo]&rdquo;</p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              12. Ley Aplicable y Jurisdicción
            </h2>
            <div className="rounded-2xl bg-card p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Esta política se rige por la legislación colombiana. En caso de
                disputa, la jurisdicción será la de Bogotá D.C.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-balance">
              13. Aceptación
            </h2>
            <div className="rounded-2xl bg-[#303030]/10 p-6 lg:p-8" style={{ border: '1px solid #303030' }}>
              <p className="text-base sm:text-lg leading-relaxed text-foreground font-medium">
                El usuario acepta esta política al registrarse, navegar o usar
                cualquiera de nuestros servicios.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

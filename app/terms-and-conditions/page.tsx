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
  { id: "section-1", title: "1. Aceptación y alcance" },
  { id: "section-2", title: "2. Definiciones básicas" },
  { id: "section-3", title: "3. Naturaleza del servicio e intermediación" },
  { id: "section-4", title: "4. Objeto de la plataforma" },
  { id: "section-5", title: "5. Registro, cuenta y seguridad" },
  { id: "section-6", title: "6. Proceso de compra y entrega" },
  { id: "section-7", title: "7. Precios, cargos y facturación" },
  { id: "section-8", title: "8. Uso de entradas, transferencias y reventa" },
  { id: "section-9", title: "9. Condiciones de acceso y permanencia" },
  { id: "section-10", title: "10. Reembolsos, cancelaciones y reprogramaciones" },
  { id: "section-11", title: "11. Derecho de retracto" },
  { id: "section-12", title: "12. Pérdida, robo, deterioro, falsificación" },
  { id: "section-13", title: "13. Propiedad intelectual" },
  { id: "section-14", title: "14. Tratamiento de datos personales" },
  { id: "section-15", title: "15. Limitación de responsabilidad" },
  { id: "section-16", title: "16. Modificaciones a los T&C" },
  { id: "section-17", title: "17. Ley aplicable y resolución de controversias" },
  { id: "section-18", title: "18. Contacto y canales de atención" },
  { id: "section-b", title: "PARTE B - Condiciones para productores" },
  { id: "section-c", title: "PARTE C - Disposiciones finales" },
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
      <ul className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto">
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
        <aside className="hidden lg:block sticky top-24 h-fit">
          <TableOfContents />
        </aside>

        {/* Main content */}
        <main className="max-w-4xl prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground">
          {/* Hero section */}
          <div className="mb-16 space-y-6 not-prose">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                TÉRMINOS Y CONDICIONES DE USO DE HUNT TICKETS S.A.S.
              </h1>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-1">Razón social</p>
                <p className="font-semibold text-foreground">Hunt Tickets S.A.S. (&ldquo;HUNT&rdquo;)</p>
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

          {/* Section 1 */}
          <section id="section-1" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">1. ACEPTACIÓN Y ALCANCE</h2>
            <p>
              Al registrarse, acceder o utilizar los servicios de HUNT (la &ldquo;Plataforma&rdquo;), el Usuario declara que ha leído, comprende y acepta íntegramente estos Términos y Condiciones (&ldquo;T&C&rdquo;). Si no está de acuerdo, deberá abstenerse de usar la Plataforma.
            </p>
            <p>
              Estos T&C regulan el uso de: (i) la aplicación móvil, (ii) el sitio web, (iii) los módulos de venta, control de acceso y transferencia de entradas, y (iv) los demás canales habilitados por HUNT (incluido WhatsApp, cuando aplique).
            </p>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">2. DEFINICIONES BÁSICAS</h2>
            <ul className="space-y-3 not-prose">
              <li className="p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                <strong className="text-foreground">Usuario Comprador (&ldquo;Comprador&rdquo;):</strong>{" "}
                <span className="text-muted-foreground">Persona que adquiere entradas a través de HUNT.</span>
              </li>
              <li className="p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                <strong className="text-foreground">Asistente:</strong>{" "}
                <span className="text-muted-foreground">Persona que utiliza la entrada para ingresar al evento.</span>
              </li>
              <li className="p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                <strong className="text-foreground">Productor/Organizador (&ldquo;Productor&rdquo;):</strong>{" "}
                <span className="text-muted-foreground">Persona natural o jurídica responsable de la realización del evento (logística, contenido, permisos, seguridad, etc.).</span>
              </li>
              <li className="p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                <strong className="text-foreground">Entrada/Boleto:</strong>{" "}
                <span className="text-muted-foreground">Derecho de acceso a un evento, en formato digital o físico, sujeto a condiciones del Productor y del Venue.</span>
              </li>
              <li className="p-4 rounded-xl bg-muted/30" style={{ border: '1px solid #303030' }}>
                <strong className="text-foreground">Servicios:</strong>{" "}
                <span className="text-muted-foreground">Conjunto de funcionalidades que provee HUNT (comercialización de boletería, software, reportes, control de acceso, atención al usuario, entre otros).</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">3. NATURALEZA DEL SERVICIO E INTERMEDIACIÓN</h2>
            <p>
              HUNT opera como plataforma tecnológica y operador de boletería, comercializando entradas por mandato de los Productores. La organización, realización, calidad, contenido, horarios, cambios de fecha o cancelaciones de los eventos no dependen de HUNT y son responsabilidad exclusiva del Productor. HUNT no es organizador ni coorganizador de los eventos.
            </p>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">4. OBJETO DE LA PLATAFORMA</h2>
            <p>A través de la Plataforma, los Usuarios pueden:</p>
            <ul>
              <li>Descubrir eventos</li>
              <li>Comprar entradas</li>
              <li>Recibir entradas digitales (por ejemplo, con código QR)</li>
              <li>Transferir entradas a otros Usuarios habilitados</li>
              <li>Recibir notificaciones, recordatorios y comunicaciones asociadas</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">5. REGISTRO, CUENTA Y SEGURIDAD</h2>
            <div className="space-y-4">
              <p><strong>5.1.</strong> El Usuario declara ser mayor de edad y tener capacidad legal para contratar.</p>
              <p><strong>5.2.</strong> La información suministrada debe ser veraz, completa y actualizada.</p>
              <p><strong>5.3.</strong> El Usuario es responsable por la confidencialidad de sus credenciales y por toda actividad realizada desde su cuenta.</p>
              <p><strong>5.4.</strong> HUNT podrá suspender o cancelar cuentas ante uso indebido, fraude o incumplimiento de estos T&C.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">6. PROCESO DE COMPRA Y ENTREGA</h2>
            <div className="space-y-4">
              <p><strong>6.1.</strong> Las transacciones están sujetas a verificación y aprobación por el banco, pasarela o medio de pago utilizado, así como a la validación de datos.</p>
              <p><strong>6.2.</strong> La entrega de la entrada se realizará en formato digital (o físico, si aplica), una vez aprobada la operación.</p>
              <p><strong>6.3.</strong> En compras con tarjeta, las devoluciones se realizarán al titular del medio de pago utilizado, salvo mecanismos específicos autorizados y comunicados.</p>
              <p><strong>6.4.</strong> Por seguridad, HUNT puede anular, bloquear o invalidar entradas ante contracargos, fraude, uso de bots, suplantaciones o inconsistencias detectadas.</p>
              <p><strong>6.5.</strong> Selección de ubicaciones: cuando el evento cuente con localidades numeradas, el Comprador confirma número de entradas, función/fecha y ubicación antes de pagar; no habrá devoluciones por errores imputables al Comprador en su selección.</p>
              <p><strong>6.6.</strong> Queda prohibido el uso de bots, multicuentas o cualquier sistema automatizado para comprar entradas.</p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">7. PRECIOS, CARGOS Y FACTURACIÓN</h2>
            <div className="space-y-4">
              <p><strong>7.1.</strong> El Comprador acepta que, además del precio de la entrada fijado por el Productor, HUNT cobra un cargo por servicio por el uso de la Plataforma y, cuando aplique, cargos de entrega o de procesamiento. Estos cargos serán informados y discriminados durante el proceso de compra y en el comprobante.</p>
              <p><strong>7.2.</strong> Los cargos por servicio están gravados con IVA según la normatividad vigente.</p>
              <p><strong>7.3.</strong> Impuestos, tasas y contribuciones aplicables a la transacción serán informados y asumidos por quien corresponda conforme a ley y a la ficha del evento.</p>
              <p><strong>7.4.</strong> En caso de errores de digitación o publicación manifiestos en precios o condiciones, HUNT podrá anular la operación y realizar la reversión correspondiente, informando al Comprador.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">8. USO DE ENTRADAS, TRANSFERENCIAS Y REVENTA</h2>
            <div className="space-y-4">
              <p><strong>8.1.</strong> La entrada es válida exclusivamente para la fecha, hora, lugar y localidad indicados.</p>
              <p><strong>8.2.</strong> El Comprador/Asistente debe conservar su entrada (digital o física) durante el evento.</p>
              <p><strong>8.3.</strong> La transferencia de entradas es una funcionalidad sujeta a disponibilidad, requisitos de identificación y controles antifraude.</p>
              <p><strong>8.4.</strong> Queda prohibido usar la entrada para fines publicitarios o promocionales (sorteos, concursos, etc.) sin autorización previa y escrita del Productor.</p>
              <p><strong>8.5.</strong> La reventa no autorizada puede dar lugar a la anulación de la entrada sin derecho a reembolso.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">9. CONDICIONES DE ACCESO Y PERMANENCIA EN EL EVENTO</h2>
            <div className="space-y-4">
              <p><strong>9.1.</strong> El ingreso está condicionado a la presentación de una entrada válida, al cumplimiento de las políticas del Productor y del Venue, a los controles de seguridad, y a la no posesión de elementos prohibidos.</p>
              <p><strong>9.2.</strong> El personal de seguridad/logística podrá negar el acceso o retirar al Asistente por razones de seguridad, incumplimiento de políticas o conducta que afecte el evento, sin derecho a reembolso.</p>
              <p><strong>9.3.</strong> El Asistente asume los riesgos inherentes a eventos de afluencia masiva.</p>
              <p><strong>9.4.</strong> Pueden existir restricciones de edad u otras condiciones especiales de acceso informadas en cada evento.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">10. REEMBOLSOS, CANCELACIONES Y REPROGRAMACIONES</h2>
            <div className="space-y-4">
              <p><strong>10.1.</strong> Como regla general, no hay cambios, reembolsos ni cancelaciones por errores del Comprador o por causas ajenas a HUNT.</p>
              <p><strong>10.2.</strong> Si el evento es cancelado o reprogramado, HUNT informará las instrucciones del Productor y el procedimiento aplicable.</p>
              <p><strong>10.3.</strong> Salvo instrucción en contrario del Productor o mandato legal/administrativo, los cargos por servicio, entrega o procesamiento no son reembolsables.</p>
              <p><strong>10.4.</strong> Cuando proceda una devolución, se efectuará al mismo medio de pago del titular de la compra, dentro de los plazos operativos informados para cada caso.</p>
              <p><strong>10.5.</strong> Si hay contracargos sobre una transacción, las entradas asociadas podrán ser canceladas y el Comprador deberá gestionarlo con su entidad financiera.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">11. DERECHO DE RETRACTO (VENTAS NO PRESENCIALES)</h2>
            <p>
              El Usuario podrá ejercer el derecho de retracto en los términos y condiciones que contempla la Ley 1480 de 2011 &ldquo;Estatuto del consumidor&rdquo; en su artículo 47 para ventas no presenciales, cuando sea aplicable al tipo de servicio adquirido. El procedimiento, plazos y excepciones se informarán en los canales de HUNT para cada caso.
            </p>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">12. PÉRDIDA, ROBO, DETERIORO, FALSIFICACIÓN</h2>
            <div className="space-y-4">
              <p><strong>12.1.</strong> HUNT no repone entradas perdidas, deterioradas, rotas o robadas.</p>
              <p><strong>12.2.</strong> Entradas adulteradas, duplicadas o falsificadas serán anuladas; HUNT podrá adoptar medidas técnicas y legales correspondientes.</p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">13. PROPIEDAD INTELECTUAL</h2>
            <div className="space-y-4">
              <p><strong>13.1. Titularidad integral.</strong> Todo el contenido y activos de la Plataforma son de titularidad exclusiva de Hunt Tickets S.A.S. o de sus terceros licenciantes, incluyendo de manera enunciativa y no limitativa: software, código fuente, algoritmos, arquitectura y documentación técnica; bases de datos (incluida su estructura y modelos); marcas, nombres comerciales, logotipos, isologos/imagotipos, manuales de marca, trade dress y elementos de look & feel; diseños e interfaces (UI/UX), composiciones gráficas, iconografías, plantillas y componentes; nombres de dominio, subdominios, nombres de aplicaciones y perfiles/cuentas oficiales; materiales audiovisuales y promocionales, así como cualquier otro elemento protegido por derechos de propiedad intelectual o industrial.</p>
              <p><strong>13.2. Exclusividad de explotación.</strong> En su calidad de titular, HUNT es la única autorizada para usar, explotar, licenciar, ceder o permitir el uso de sus signos distintivos, software y demás activos protegidos. Productores y terceros no podrán utilizar la marca, logotipos, diseños, interfaces o cualquier elemento protegido de HUNT sin autorización previa, expresa y por escrito de HUNT y conforme a sus Lineamientos de Marca y demás condiciones que HUNT disponga.</p>
              <p><strong>13.3. Licencia limitada al Usuario.</strong> El acceso a la Plataforma confiere al Usuario una licencia personal, revocable, no exclusiva, intransferible y no sublicenciable para usar los Servicios conforme a estos T&C. Esta licencia no otorga derecho alguno de copia, reproducción, publicación, adaptación, traducción, modificación, ingeniería inversa, descompilación, creación de obras derivadas, distribución, alquiler, explotación comercial, scraping automatizado fuera de APIs autorizadas ni ningún otro uso no permitido expresamente.</p>
              <p><strong>13.4. Uso no autorizado y medidas.</strong> Ante cualquier uso no autorizado de las obras o activos protegidos de HUNT, ésta podrá (i) requerir cese y retiro inmediato; (ii) bloquear cuentas, accesos o integraciones; (iii) adoptar salvaguardas técnicas para proteger sus derechos; y (iv) ejercer acciones civiles, comerciales, administrativas y penales, solicitando medidas cautelares e indemnización de perjuicios, incluidos costos y honorarios profesionales.</p>
              <p><strong>13.5. Reporte de infracciones.</strong> Si considera que algún contenido infringe derechos de propiedad intelectual, escríbanos a info@hunt-tickets.com con los soportes correspondientes para su atención prioritaria.</p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">14. TRATAMIENTO DE DATOS PERSONALES</h2>
            <div className="space-y-4">
              <p><strong>14.1.</strong> Al registrarse, el Usuario autoriza a HUNT para recolectar, almacenar, usar, analizar, circular, transmitir y compartir sus datos personales conforme a la Ley 1581 de 2012 y a estas finalidades: (i) prestar los Servicios, (ii) verificación antifraude y seguridad, (iii) atención al usuario, (iv) comunicaciones transaccionales y promocionales, (v) analítica de datos, personalización y mejora de producto (incluido entrenamiento de modelos de IA), y (vi) cumplimiento de obligaciones legales/contractuales.</p>
              <p><strong>14.2.</strong> HUNT podrá compartir datos con aliados y proveedores (por ejemplo, pasarelas de pago, mensajería, servicios en la nube) bajo acuerdos de confidencialidad y seguridad, para las finalidades aquí autorizadas.</p>
              <p><strong>14.3.</strong> El Usuario podrá ejercer sus derechos de acceso, actualización, corrección y supresión a través de los canales de contacto de HUNT.</p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">15. LIMITACIÓN DE RESPONSABILIDAD</h2>
            <div className="space-y-4">
              <p><strong>15.1.</strong> HUNT no es responsable por la organización, realización, calidad, contenido, cambios, cancelaciones o condiciones del evento, que son competencia del Productor.</p>
              <p><strong>15.2.</strong> HUNT no será responsable por fallas de pasarelas o medios de pago, rechazo de transacciones o políticas de seguridad de terceros.</p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">16. MODIFICACIONES A LOS T&C</h2>
            <p>
              HUNT podrá modificar estos T&C en cualquier momento. La versión vigente estará disponible en los canales oficiales. El uso continuado de la Plataforma implica aceptación de la versión vigente.
            </p>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">17. LEY APLICABLE Y RESOLUCIÓN DE CONTROVERSIAS</h2>
            <p>
              Estos T&C se rigen por las leyes de la República de Colombia. Cualquier controversia se resolverá ante los jueces de Bogotá D.C., sin perjuicio de los mecanismos alternativos de solución de controversias que las partes puedan adelantar.
            </p>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="mb-20 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">18. CONTACTO Y CANALES DE ATENCIÓN</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">Correo</p>
                <p className="font-semibold text-primary">info@hunt-tickets.com</p>
              </div>
              <div className="p-6 rounded-xl bg-card" style={{ border: '1px solid #303030' }}>
                <p className="text-sm text-muted-foreground mb-2">WhatsApp</p>
                <p className="font-semibold text-primary">+57 322 8597640</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border sm:col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Dirección</p>
                <p className="font-semibold text-foreground">Calle 94 #9-44, Bogotá D.C., Colombia</p>
              </div>
            </div>
          </section>

          {/* PARTE B */}
          <section id="section-b" className="mb-20 scroll-mt-24 not-prose">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10" style={{ border: '1px solid #303030' }}>
              <h2 className="text-3xl font-bold mb-8">PARTE B – CONDICIONES PARA PRODUCTORES / ORGANIZADORES</h2>
              <p className="text-muted-foreground mb-8">
                Las siguientes condiciones aplican cuando el Productor contrata o utiliza los servicios de HUNT para la comercialización de boletería, control de acceso, reportes, comunicaciones y demás funcionalidades asociadas.
              </p>

              <div className="space-y-8 prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
                <div>
                  <h3 className="text-xl font-bold mb-4">B1. RELACIÓN CONTRACTUAL Y ALCANCE</h3>
                  <p><strong>B1.1.</strong> HUNT presta servicios de operador de boletería y software para la comercialización y gestión de accesos del evento. HUNT no es organizador, realizador, productor ni responsable de las obligaciones frente a asistentes, autoridades o terceros, distintas a las propias del servicio de boletería.</p>
                  <p><strong>B1.2.</strong> El Productor es exclusivamente responsable por: (i) permisos, licencias, seguros, PULEP y aforos; (ii) seguridad, logística, atención y cumplimiento frente a asistentes; (iii) veracidad de la información publicada; (iv) calidad y contenido del evento; (v) cumplimiento de la normatividad aplicable; y (vi) definición de políticas de cancelación/reprogramación.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B2. TARIFAS, COMISIONES, IMPUESTOS Y RETENCIÓN</h3>
                  <p><strong>B2.1.</strong> Por la prestación del servicio, HUNT cobrará al Productor una comisión del diez por ciento (10%) del valor de cada boleta vendida, más el IVA aplicable únicamente sobre ese 10%.</p>
                  <p><strong>B2.2.</strong> La comisión de HUNT aplica a todas las ventas de boletería del evento realizadas a través de HUNT, por la página web, por la app, por canales habilitados y también a las ventas en efectivo, incluyendo pero sin limitarse a taquilla.</p>
                  <p><strong>B2.3.</strong> HUNT podrá retener su comisión e impuestos directamente del recaudo de boletería y girará al Productor el valor neto (total recaudado por entradas menos la comisión e impuestos a cargo del servicio de HUNT).</p>
                  <p><strong>B2.4.</strong> En ventas efectivo/taquilla realizadas por el Productor, éste deberá reportar y transferir a HUNT el valor de la comisión e impuestos dentro de los cinco (5) días hábiles siguientes a la venta, o autoriza desde ya a HUNT a compensar dichos valores con cualquier saldo a favor en otras liquidaciones.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B3. LIQUIDACIONES Y DESEMBOLSOS</h3>
                  <p><strong>B3.1.</strong> Salvo pacto distinto por escrito, HUNT liquidará y desembolsará al Productor el valor neto recaudado dentro de los diez (10) días hábiles siguientes a la fecha del evento o del cierre de ventas, lo que ocurra después, sujeto a: (i) contracargos, (ii) devoluciones autorizadas por el Productor o exigidas por autoridad, y (iii) retenciones/impuestos/compensaciones aplicables.</p>
                  <p><strong>B3.2.</strong> HUNT podrá retener montos en reserva razonables para cubrir riesgos de contracargos, fraudes o devoluciones durante un periodo prudencial informado al Productor.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B4. CONTRACARGOS, FRAUDE Y DEVOLUCIONES</h3>
                  <p><strong>B4.1.</strong> Los contracargos y devoluciones derivados del evento son a cargo del Productor por el valor de la boleta y los costos asociados (tarifas bancarias/pasarelas), pudiendo HUNT descontarlos de liquidaciones presentes o futuras.</p>
                  <p><strong>B4.2.</strong> HUNT podrá anular transacciones y bloquear códigos de acceso cuando detecte riesgo de fraude, reventa no autorizada, uso de bots o incumplimientos.</p>
                  <p><strong>B4.3.</strong> En cancelaciones o reprogramaciones, el Productor financiará las devoluciones que correspondan y HUNT ejecutará el proceso operativo; salvo orden legal, la comisión de HUNT no es reembolsable al ser la remuneración del servicio prestado.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B5. INFORMACIÓN DEL EVENTO Y OBLIGACIONES DEL PRODUCTOR</h3>
                  <p><strong>B5.1.</strong> El Productor deberá cargar y mantener información veraz, completa y actualizada del evento (fechas, horarios, restricciones de edad, políticas de acceso, elementos prohibidos, mapa de localidades, capacidades, etc.).</p>
                  <p><strong>B5.2.</strong> El Productor garantiza contar con todos los permisos y seguros exigidos por la normativa aplicable, así como cumplir con las obligaciones tributarias y con las autoridades de inspección, vigilancia y control.</p>
                  <p><strong>B5.3.</strong> El Productor indemnizará y mantendrá indemne a HUNT frente a reclamaciones de asistentes, autoridades o terceros relacionadas con el evento.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B6. DATOS, CONFIDENCIALIDAD Y PROPIEDAD INTELECTUAL</h3>
                  <p><strong>B6.1.</strong> HUNT compartirá con el Productor la información estrictamente necesaria para la operación del evento (por ejemplo, listados de acceso), bajo obligaciones de confidencialidad y seguridad.</p>
                  <p><strong>B6.2.</strong> Los datos de Usuarios no podrán ser usados por el Productor para fines promocionales sin contar con las autorizaciones legales y del titular de los datos cuando aplique.</p>
                  <p><strong>B6.3.</strong> Cada parte conservará la titularidad de sus marcas y contenidos. El uso de marcas se limita a la promoción del evento en la Plataforma y otros materiales autorizados por escrito.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B7. DISPONIBILIDAD DEL SERVICIO Y SOPORTE</h3>
                  <p><strong>B7.1.</strong> HUNT prestará los Servicios con criterios de mejores esfuerzos, sin garantizar disponibilidad ininterrumpida.</p>
                  <p><strong>B7.2.</strong> HUNT brindará soporte razonable al Productor a través de los canales definidos.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B8. AUDITORÍA Y CUMPLIMIENTO</h3>
                  <p><strong>B8.1.</strong> HUNT podrá realizar verificaciones y auditorías razonables sobre la información de ventas y accesos para prevenir fraude o evasión de comisiones.</p>
                  <p><strong>B8.2.</strong> El Productor se obliga a cooperar y a proporcionar la información necesaria en forma oportuna.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">B9. TERMINACIÓN</h3>
                  <p><strong>B9.1.</strong> Cualquiera de las partes podrá terminar la relación con el preaviso pactado o, en su defecto, con un preaviso de quince (15) días calendario.</p>
                  <p><strong>B9.2.</strong> La terminación no afecta obligaciones de pago, confidencialidad, liquidaciones pendientes ni compensaciones por contracargos.</p>
                  <p><strong>B9.3.</strong> HUNT podrá suspender la venta, el canje o el escaneo de entradas ante incumplimientos de pago o riesgos de fraude.</p>
                </div>
              </div>
            </div>
          </section>

          {/* PARTE C */}
          <section id="section-c" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">PARTE C – DISPOSICIONES FINALES</h2>
            <div className="space-y-4">
              <p><strong>C1.</strong> Estos T&C sustituyen versiones anteriores.</p>
              <p><strong>C2.</strong> La nulidad de alguna cláusula no afectará la validez del resto.</p>
              <p><strong>C3.</strong> Las comunicaciones se entenderán válidas cuando se envíen a los datos de contacto registrados en HUNT.</p>
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-[#303030]/10" style={{ border: '1px solid #303030' }}>
              <p className="text-lg font-semibold text-foreground text-center">
                Al usar la Plataforma, el Usuario y/o el Productor manifiestan su aceptación libre, expresa e informada de estos Términos y Condiciones.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

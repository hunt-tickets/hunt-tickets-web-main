"use client";

import { Mail, Phone, MapPin, Building2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Política de Privacidad
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
            Hunt Tickets S.A.S.
          </p>
          <p className="text-sm text-muted-foreground">
            Fecha de entrada en vigencia: 03 de abril de 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:py-16">
        {/* Introduction */}
        <div className="mb-12 sm:mb-16">
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            Hunt Tickets S.A.S., en adelante &ldquo;HUNT&rdquo;, reconoce la importancia de
            proteger la privacidad de los datos personales de sus usuarios, y se
            compromete con el tratamiento adecuado, responsable y seguro de la
            información recolectada a través de sus plataformas tecnológicas,
            conforme a la legislación colombiana vigente.
          </p>
        </div>

        {/* Section 1 - Company Info */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="responsable">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            1. Identificación del Responsable
          </h2>
          <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Razón social
                </p>
                <p className="text-base font-semibold text-foreground">
                  Hunt Tickets S.A.S.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">NIT</p>
                <p className="text-base font-semibold text-foreground">
                  901881747
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Domicilio</p>
                <p className="text-base font-semibold text-foreground">
                  Calle 94 #9-44, Bogotá D.C., Colombia
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Correo</p>
                <a
                  href="mailto:info@hunt-tickets.com"
                  className="text-base font-semibold text-primary hover:underline"
                >
                  info@hunt-tickets.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                <a
                  href="https://api.whatsapp.com/send/?phone=+573228597640"
                  className="text-base font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +57 322 8597640
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Definitions */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="definiciones">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            2. Definiciones Relevantes
          </h2>
          <div className="grid gap-3 sm:gap-4">
            {[
              {
                term: "Dato personal",
                def: "Información que permite identificar a una persona.",
              },
              {
                term: "Titular",
                def: "Persona natural dueña de los datos personales.",
              },
              {
                term: "Tratamiento",
                def: "Recolección, almacenamiento, uso, circulación o supresión.",
              },
              {
                term: "Encargado",
                def: "Persona o entidad que trata datos por cuenta del responsable.",
              },
              {
                term: "Autorización",
                def: "Consentimiento previo, expreso e informado del titular.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <p className="text-base text-foreground">
                  <span className="font-semibold text-foreground">
                    {item.term}:
                  </span>{" "}
                  <span className="text-muted-foreground">{item.def}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 - Data Collection */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="datos">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            3. Datos que Recolectamos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                title: "Identificación",
                desc: "nombre, documento, fecha de nacimiento, género",
              },
              {
                title: "Contacto",
                desc: "correo electrónico, celular, ciudad",
              },
              {
                title: "Comportamiento",
                desc: "eventos visualizados, favoritos, compras",
              },
              {
                title: "Técnicos",
                desc: "IP, dispositivo, navegador, sistema operativo",
              },
              {
                title: "Transaccionales",
                desc: "medios de pago, frecuencia, valor de compra",
              },
              {
                title: "Sensibles",
                desc: "ubicación, intereses culturales o musicales",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-muted/50 border border-border"
              >
                <p className="font-semibold text-foreground mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 - Purpose */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="finalidades">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            4. Finalidades del Tratamiento
          </h2>

          <div className="space-y-6">
            {/* Subsection 4.1 */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                4.1 Finalidades operativas
              </h3>
              <div className="space-y-2.5">
                {[
                  "Crear y gestionar su cuenta",
                  "Procesar compras de entradas",
                  "Enviar boletos y recordatorios",
                  "Acceso y registro a eventos",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsection 4.2 */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                4.2 Finalidades analíticas y comerciales
              </h3>
              <div className="space-y-2.5">
                {[
                  "Analizar comportamiento y consumo",
                  "Personalizar recomendaciones",
                  "Mejorar algoritmos y experiencia",
                  "Estudios de mercado internos",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsection 4.3 */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
                4.3 Publicidad y monetización
              </h3>
              <div className="space-y-2.5">
                {[
                  "Promociones personalizadas",
                  "Beneficios o cupones según perfil",
                  "Compartir información con aliados estratégicos bajo confidencialidad para marketing y desarrollo",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Note */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 sm:p-6">
              <p className="text-sm sm:text-base text-foreground">
                <span className="font-semibold">Nota importante:</span> Nunca
                venderemos datos personales sin autorización expresa.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 - Sensitive Data */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="sensibles">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            5. Tratamiento de Datos Sensibles y de Menores
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-3">
            <p className="text-base text-muted-foreground leading-relaxed">
              No es obligatorio suministrar datos sensibles.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Se presume que los menores tienen consentimiento de su
              representante legal.
            </p>
          </div>
        </section>

        {/* Section 6 - Rights */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="derechos">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            6. Derechos del Titular
          </h2>
          <p className="text-muted-foreground mb-5">
            Conforme a la Ley 1581 de 2012, el titular puede:
          </p>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-3">
            {[
              "Conocer, actualizar y rectificar sus datos.",
              "Solicitar prueba de la autorización.",
              "Ser informado sobre el uso de sus datos.",
              "Revocar autorización o solicitar supresión.",
              "Acceder gratuitamente a su información.",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-base text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7 - Security */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="seguridad">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            7. Medidas de Seguridad
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              HUNT implementa medidas técnicas, humanas y administrativas para
              proteger la información contra pérdidas, accesos no autorizados, o
              usos indebidos.
            </p>
          </div>
        </section>

        {/* Section 8 - International Transfer */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="transferencia">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            8. Transferencia Internacional de Datos
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Si se transfieren datos a otros países, se garantizará un nivel de
              protección equivalente al colombiano.
            </p>
          </div>
        </section>

        {/* Section 9 - Data Retention */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="conservacion">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            9. Tiempo de Conservación de Datos
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Los datos serán conservados el tiempo necesario para cumplir las
              finalidades, luego se eliminarán o anonimizarán según la ley.
            </p>
          </div>
        </section>

        {/* Section 10 - Policy Changes */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="modificaciones">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            10. Modificaciones a la Política de Privacidad
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Esta política puede cambiar. Los cambios serán informados en
              nuestros canales. Su uso continuo implica aceptación de las
              modificaciones.
            </p>
          </div>
        </section>

        {/* Section 11 - Exercise Rights */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="procedimiento">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            11. Procedimiento para Ejercer sus Derechos
          </h2>
          <p className="text-muted-foreground mb-5">
            Puede ejercer sus derechos escribiendo a:
          </p>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Correo</p>
                <a
                  href="mailto:info@hunt-tickets.com"
                  className="text-base font-semibold text-primary hover:underline"
                >
                  info@hunt-tickets.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                <a
                  href="https://api.whatsapp.com/send/?phone=+573228597640"
                  className="text-base font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +57 322 8597640
                </a>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Asunto:</span>{" "}
                &ldquo;Protección de Datos – [Nombre completo]&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Section 12 - Applicable Law */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="jurisdiccion">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            12. Ley Aplicable y Jurisdicción
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              Esta política se rige por la legislación colombiana. En caso de
              disputa, la jurisdicción será la de Bogotá D.C.
            </p>
          </div>
        </section>

        {/* Section 13 - Acceptance */}
        <section className="mb-12 sm:mb-16 scroll-mt-20" id="aceptacion">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            13. Aceptación
          </h2>
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-5 sm:p-6">
            <p className="text-base text-foreground leading-relaxed">
              El usuario acepta esta política al registrarse, navegar o usar
              cualquiera de nuestros servicios.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

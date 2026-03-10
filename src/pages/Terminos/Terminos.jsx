import Container from "../../components/layout/Container/Container";

export default function Terminos() {
  return (
    <main>
      <section style={{ padding: "56px 0" }}>
        <Container>
          <div style={{ maxWidth: "900px" }}>
            <span
              style={{
                display: "inline-block",
                marginBottom: 12,
                padding: "6px 12px",
                borderRadius: 999,
                background: "#eef3ea",
                color: "#3d5a40",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Legal
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
                margin: "0 0 18px",
                color: "#183a2d",
              }}
            >
              Términos y condiciones
            </h1>

            <p style={p}>
              El acceso y uso de Vive en un Pueblo implica la aceptación de los
              presentes términos y condiciones. Si una persona no está de acuerdo
              con ellos, deberá abstenerse de utilizar el sitio.
            </p>

            <h2 style={h2}>1. Objeto del sitio</h2>
            <p style={p}>
              Vive en un Pueblo es una plataforma informativa y de conexión que
              permite explorar pueblos, consultar publicaciones y, en su caso,
              facilitar el contacto o la difusión de oportunidades, vivienda,
              traspasos u otra información relacionada.
            </p>

            <h2 style={h2}>2. Uso adecuado</h2>
            <p style={p}>El usuario se compromete a utilizar el sitio de forma lícita y responsable.</p>
            <ul style={ul}>
              <li>publicar información falsa, engañosa o fraudulenta;</li>
              <li>suplantar identidad;</li>
              <li>subir contenido ofensivo, ilícito o que infrinja derechos de terceros;</li>
              <li>afectar el funcionamiento del sitio o intentar vulnerar su seguridad;</li>
              <li>usar el sitio para spam o actividades no autorizadas.</li>
            </ul>

            <h2 style={h2}>3. Contenido publicado por usuarios</h2>
            <p style={p}>
              El usuario es responsable del contenido que envíe, publique o
              comparta en el sitio. Al hacerlo, declara contar con derechos o
              autorización suficiente sobre dicho contenido y asume la
              responsabilidad por su veracidad y legalidad.
            </p>
            <p style={p}>
              El sitio podrá moderar, ocultar, rechazar o eliminar contenido que
              considere inapropiado, riesgoso, engañoso o contrario a estos
              términos.
            </p>

            <h2 style={h2}>4. Disponibilidad del servicio</h2>
            <p style={p}>
              No se garantiza que el sitio esté disponible en todo momento ni
              libre de errores. Podrán realizarse cambios, pausas, mejoras,
              actualizaciones o interrupciones sin previo aviso.
            </p>

            <h2 style={h2}>5. Exactitud de la información</h2>
            <p style={p}>
              Aunque procuramos mantener información útil y actualizada, no
              garantizamos que todo el contenido publicado sea completo, exacto o
              actualizado en todos los casos. El usuario debe verificar por su
              cuenta cualquier información relevante antes de tomar decisiones.
            </p>

            <h2 style={h2}>6. Enlaces y terceros</h2>
            <p style={p}>
              El sitio puede contener enlaces a sitios, servicios o recursos de
              terceros. No somos responsables por su contenido, disponibilidad,
              políticas o prácticas.
            </p>

            <h2 style={h2}>7. Propiedad intelectual</h2>
            <p style={p}>
              Salvo que se indique lo contrario, los textos, elementos visuales,
              diseño, estructura y demás componentes del sitio forman parte de
              Vive en un Pueblo o se utilizan con autorización. No podrán
              reproducirse o explotarse sin autorización correspondiente.
            </p>

            <h2 style={h2}>8. Limitación de responsabilidad</h2>
            <p style={p}>
              Vive en un Pueblo no será responsable por pérdidas, daños o
              perjuicios derivados del uso del sitio, de la imposibilidad de
              usarlo, de errores en publicaciones de terceros o de acuerdos,
              contactos o transacciones que puedan surgir entre usuarios o
              terceros.
            </p>

            <h2 style={h2}>9. Modificaciones</h2>
            <p style={p}>
              Estos términos podrán modificarse en cualquier momento. La versión
              vigente será la publicada en esta página.
            </p>

            <h2 style={h2}>10. Contacto</h2>
            <p style={p}>
              Para dudas relacionadas con estos términos, se podrán utilizar los
              medios de contacto publicados en el sitio.
            </p>

            <p style={meta}>Última actualización: marzo de 2026</p>
          </div>
        </Container>
      </section>
    </main>
  );
}

const p = {
  color: "#4d5b52",
  lineHeight: 1.8,
  fontSize: "1rem",
  margin: "0 0 16px",
};

const h2 = {
  color: "#183a2d",
  fontSize: "1.25rem",
  margin: "28px 0 12px",
};

const ul = {
  color: "#4d5b52",
  lineHeight: 1.8,
  paddingLeft: "20px",
  margin: "0 0 16px",
};

const meta = {
  marginTop: "32px",
  color: "#6c7a70",
  fontSize: "0.95rem",
};
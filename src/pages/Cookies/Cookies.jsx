import Container from "../../components/layout/Container/Container";

export default function Cookies() {
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
              Política de cookies
            </h1>

            <p style={p}>
              Esta política explica qué son las cookies, cómo pueden utilizarse
              en Vive en un Pueblo y qué opciones tiene el usuario respecto a su
              uso.
            </p>

            <h2 style={h2}>1. Qué son las cookies</h2>
            <p style={p}>
              Las cookies son pequeños archivos que se almacenan en el navegador
              o dispositivo cuando una persona visita un sitio web. Sirven para
              recordar información, facilitar funciones y obtener datos de uso.
            </p>

            <h2 style={h2}>2. Para qué pueden usarse en este sitio</h2>
            <p style={p}>Podemos utilizar cookies o tecnologías similares para:</p>
            <ul style={ul}>
              <li>recordar preferencias básicas del usuario;</li>
              <li>mejorar el rendimiento y funcionamiento del sitio;</li>
              <li>analizar tráfico y comportamiento de navegación;</li>
              <li>facilitar integraciones técnicas o servicios de terceros.</li>
            </ul>

            <h2 style={h2}>3. Tipos de cookies</h2>
            <p style={p}>
              Dependiendo de la implementación del sitio, podrían utilizarse
              cookies técnicas, funcionales, analíticas o de terceros.
            </p>

            <h2 style={h2}>4. Cookies de terceros</h2>
            <p style={p}>
              Algunos servicios externos integrados en el sitio pueden utilizar
              sus propias cookies o tecnologías similares. Su tratamiento se rige
              también por las políticas del proveedor correspondiente.
            </p>

            <h2 style={h2}>5. Gestión de cookies</h2>
            <p style={p}>
              El usuario puede configurar su navegador para bloquear, eliminar o
              limitar cookies. Debe tener en cuenta que algunas funciones del
              sitio podrían dejar de operar correctamente si se deshabilitan
              ciertas cookies.
            </p>

            <h2 style={h2}>6. Cambios a esta política</h2>
            <p style={p}>
              Esta política podrá actualizarse para reflejar cambios técnicos,
              operativos o legales. La versión vigente será la publicada aquí.
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
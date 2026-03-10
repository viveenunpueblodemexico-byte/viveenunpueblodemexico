import Container from "../../components/layout/Container/Container";

export default function Privacidad() {
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
              Política de privacidad
            </h1>

            <p style={p}>
              En Vive en un Pueblo valoramos la privacidad de las personas que
              visitan y utilizan este sitio. Esta política explica, de forma
              general, qué información podemos recopilar, cómo la usamos y qué
              medidas aplicamos para protegerla.
            </p>

            <h2 style={h2}>1. Información que podemos recopilar</h2>
            <p style={p}>
              Podemos recopilar información que el usuario proporcione de manera
              voluntaria al utilizar formularios, suscribirse a novedades,
              publicar información o ponerse en contacto con el sitio.
            </p>
            <p style={p}>
              También podemos obtener datos técnicos básicos de navegación, como
              dirección IP, tipo de dispositivo, navegador, páginas visitadas,
              horarios de acceso y datos de uso del sitio, ya sea de forma
              directa o mediante herramientas de terceros.
            </p>

            <h2 style={h2}>2. Uso de la información</h2>
            <p style={p}>La información recopilada podrá utilizarse para:</p>
            <ul style={ul}>
              <li>operar y mejorar el sitio;</li>
              <li>responder mensajes o solicitudes;</li>
              <li>gestionar publicaciones, formularios o registros;</li>
              <li>enviar novedades o comunicaciones, cuando el usuario lo solicite;</li>
              <li>prevenir usos indebidos, fraude o actividad no autorizada.</li>
            </ul>

            <h2 style={h2}>3. Publicaciones y contenido de usuarios</h2>
            <p style={p}>
              Si el usuario envía información para publicar ofertas, anuncios,
              datos de contacto u otro contenido, entiende que cierta
              información podrá mostrarse públicamente dentro del sitio, según la
              naturaleza de la publicación.
            </p>

            <h2 style={h2}>4. Servicios de terceros</h2>
            <p style={p}>
              El sitio puede apoyarse en servicios de terceros para hosting,
              bases de datos, analítica, autenticación, formularios, envío de
              correos u otras funciones técnicas. Estos proveedores pueden
              tratar cierta información conforme a sus propias políticas de
              privacidad.
            </p>

            <h2 style={h2}>5. Cookies y tecnologías similares</h2>
            <p style={p}>
              Este sitio puede utilizar cookies o tecnologías similares para
              recordar preferencias, mejorar el funcionamiento, analizar tráfico
              y ofrecer una mejor experiencia. Para más detalle, consulta nuestra
              Política de Cookies.
            </p>

            <h2 style={h2}>6. Conservación de datos</h2>
            <p style={p}>
              Conservaremos la información durante el tiempo que resulte
              razonablemente necesario para operar el sitio, cumplir finalidades
              legítimas, atender solicitudes, resolver controversias y cumplir
              obligaciones aplicables.
            </p>

            <h2 style={h2}>7. Seguridad</h2>
            <p style={p}>
              Procuramos aplicar medidas razonables de seguridad para proteger la
              información. Sin embargo, ningún sistema de transmisión o
              almacenamiento electrónico puede garantizar seguridad absoluta.
            </p>

            <h2 style={h2}>8. Derechos y solicitudes</h2>
            <p style={p}>
              El usuario puede solicitar información sobre sus datos, pedir
              correcciones o solicitar la eliminación de información que haya
              proporcionado, cuando ello sea procedente. Estas solicitudes podrán
              atenderse a través de los medios de contacto del sitio.
            </p>

            <h2 style={h2}>9. Cambios a esta política</h2>
            <p style={p}>
              Esta política podrá actualizarse en cualquier momento para reflejar
              cambios operativos, legales o técnicos. La versión vigente será la
              publicada en esta página.
            </p>

            <h2 style={h2}>10. Contacto</h2>
            <p style={p}>
              Si tienes dudas sobre esta Política de Privacidad, puedes
              comunicarte a través de los canales de contacto publicados en el
              sitio.
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
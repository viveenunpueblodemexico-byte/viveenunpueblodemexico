import Container from "../../components/layout/Container/Container";

export default function Acerca() {
  return (
    <main>
      <section style={{ padding: "56px 0 32px" }}>
        <Container>
          <div style={{ maxWidth: "860px" }}>
            <span
              style={{
                display: "inline-block",
                marginBottom: "12px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#eef3ea",
                color: "#3d5a40",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Acerca de
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.1,
                margin: "0 0 18px",
                color: "#183a2d",
              }}
            >
              Vive en un Pueblo
            </h1>

            <p
              style={{
                fontSize: "1.08rem",
                lineHeight: 1.8,
                color: "#4d5b52",
                marginBottom: "18px",
              }}
            >
              Vive en un Pueblo es una plataforma para descubrir pueblos de
              México con potencial para vivir, trabajar, emprender o comenzar
              una nueva etapa con más tranquilidad y mejor calidad de vida.
            </p>

            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.8,
                color: "#4d5b52",
                marginBottom: "18px",
              }}
            >
              Reunimos información útil sobre localidades, oportunidades,
              vivienda, traspasos y otros elementos que pueden ayudar a tomar
              decisiones mejor informadas.
            </p>

            <p
              style={{
                fontSize: "1.02rem",
                lineHeight: 1.8,
                color: "#4d5b52",
                marginBottom: "18px",
              }}
            >
              El objetivo del proyecto es visibilizar opciones fuera de las
              grandes ciudades y conectar a personas con lugares que ofrezcan
              nuevas posibilidades de desarrollo personal, familiar o laboral.
            </p>

            <div
              style={{
                marginTop: "32px",
                padding: "24px",
                border: "1px solid #e7e3da",
                borderRadius: "20px",
                background: "#faf8f3",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  fontSize: "1.2rem",
                  color: "#183a2d",
                }}
              >
                Qué encontrarás aquí
              </h2>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "#4d5b52",
                  lineHeight: 1.9,
                }}
              >
                <li>Pueblos con información general y contexto.</li>
                <li>Oportunidades de trabajo publicadas por usuarios.</li>
                <li>Opciones de vivienda y traspasos.</li>
                <li>Una base en crecimiento para explorar alternativas reales.</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
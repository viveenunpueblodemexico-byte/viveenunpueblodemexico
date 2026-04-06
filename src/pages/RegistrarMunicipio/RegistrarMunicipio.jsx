import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { buildAbsoluteUrl, clearManagedSEO, setPageSEO } from "../../utils/seo";
import "./registrarMunicipio.css";

const INITIAL = {
  nombreMunicipio: "",
  estado: "",
  nombreContacto: "",
  email: "",
  mensaje: "",
};

export default function RegistrarMunicipio() {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPageSEO({
      title: "Registrar municipio | Vive en un Pueblo de México",
      description:
        "Municipios y administraciones públicas pueden registrar su interés para sumarse a Vive en un Pueblo de México.",
      url: buildAbsoluteUrl("/registrar-municipio"),
      type: "website",
    });

    return () => clearManagedSEO();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!form.nombreMunicipio.trim() || !form.estado.trim() || !form.email.trim()) {
        throw new Error("Completa municipio, estado y correo de contacto.");
      }

      await addDoc(collection(db, "leads_municipio"), {
        ...form,
        origen: "web_form",
        createdAt: serverTimestamp(),
      });

      setDone(true);
      setForm(INITIAL);
    } catch (err) {
      setError(err?.message || "No pudimos enviar tu solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="registroMunicipio">
      <div className="registroMunicipio__layout">
        <section className="registroMunicipio__intro">
          <h1 className="registroMunicipio__title">Registrar municipio</h1>
          <p className="registroMunicipio__sub">
            Si representas un ayuntamiento o administración pública, comparte tus datos y te contactamos para evaluar su incorporación al catálogo.
          </p>
          <ul className="registroMunicipio__bullets">
            <li>Respuesta inicial en 48–72 horas hábiles.</li>
            <li>Validación de información institucional y de contacto.</li>
            <li>Acompañamiento para publicación de oportunidades locales.</li>
          </ul>
        </section>

        <section className="registroMunicipio__card">
          <form className="registroMunicipio__form" onSubmit={onSubmit}>
            <label className="registroMunicipio__field">
              Municipio *
              <input name="nombreMunicipio" value={form.nombreMunicipio} onChange={onChange} required />
            </label>

            <label className="registroMunicipio__field">
              Estado *
              <input name="estado" value={form.estado} onChange={onChange} required />
            </label>

            <label className="registroMunicipio__field">
              Nombre de contacto
              <input name="nombreContacto" value={form.nombreContacto} onChange={onChange} />
            </label>

            <label className="registroMunicipio__field">
              Correo de contacto *
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>

            <label className="registroMunicipio__field">
              Mensaje
              <textarea name="mensaje" value={form.mensaje} onChange={onChange} rows={4} />
            </label>

            {error ? <p className="registroMunicipio__error">{error}</p> : null}
            {done ? <p className="registroMunicipio__ok">¡Listo! Recibimos tu solicitud.</p> : null}

            <button className="btnPrimary" type="submit" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const destinations = [
  {
    title: 'Especificación',
    to: '/specification/',
    description: 'Requisitos, reglas de negocio y alcance vigente de Menu/Catálogo.',
    action: 'Leer la especificación',
  },
  {
    title: 'API',
    to: '/api/',
    description: 'Referencia OpenAPI 8.0.1 del servicio Menu: endpoints, esquemas, errores y permisos.',
    action: 'Consultar la referencia API',
  },
  {
    title: 'Eventos',
    to: '/events/',
    description: 'Contrato AsyncAPI de los eventos entre Menu e Inventario: orígenes de contenido y su disponibilidad.',
    action: 'Consultar los eventos',
  },
];

export default function HomePage() {
  return (
    <Layout
      title="Restaurant Platform"
      description="Documentación del servicio Menu/Catálogo de Restaurant Platform"
    >
      <main className={`container ${styles.page}`}>
        <section className={styles.hero} aria-labelledby="home-title">
          <p className={styles.eyebrow}>Documentación del servicio Menu</p>
          <h1 className={styles.title} id="home-title">
            Restaurant Platform
          </h1>
          <p className={styles.intro}>
            Consulta los requisitos, la referencia de la API y el contrato de eventos del servicio Menu/Catálogo.
          </p>
        </section>

        <section className={styles.destinations} aria-labelledby="destinations-title">
          <h2 className={styles.sectionTitle} id="destinations-title">
            Explora la documentación
          </h2>
          <nav aria-label="Secciones de documentación">
            <div className={styles.cards}>
              {destinations.map(({ title, to, description, action, status }) => (
                <article className={styles.card} key={to}>
                  <Link className={styles.cardLink} to={to}>
                    <div className={styles.cardHeading}>
                      <h3 className={styles.cardTitle}>{title}</h3>
                      {status && <span className={styles.cardStatus}>{status}</span>}
                    </div>
                    <p className={styles.cardDescription}>{description}</p>
                    <span className={styles.cardAction}>
                      {action}
                      <span aria-hidden="true"> →</span>
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </nav>
        </section>
      </main>
    </Layout>
  );
}

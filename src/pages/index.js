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
    title: 'Modelo conceptual',
    to: '/reference/md/domain-model/',
    description: 'Entidades, relaciones y reglas estructurales del catálogo.',
    action: 'Consultar el modelo',
  },
  {
    title: 'API',
    to: '/api/',
    description: 'La página de referencia se mantiene; las operaciones y los datos se definirán tras revisar los mockups.',
    action: 'Consultar la referencia API',
  },
  {
    title: 'Eventos',
    to: '/events/',
    description: 'La definición de eventos permanece pendiente.',
    action: 'Consultar el estado',
    status: 'Pendiente',
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
            Consulta los requisitos, el modelo conceptual y el estado de las referencias del servicio Menu/Catálogo.
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

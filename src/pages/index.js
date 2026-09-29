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
    title: 'MVPs',
    to: '/product/',
    description: 'Roadmap y planes de implementación organizados en tres entregas.',
    action: 'Explorar los MVPs',
  },
  {
    title: 'API',
    to: '/api/',
    description: 'Contrato HTTP vigente y referencia interactiva de sus operaciones.',
    action: 'Consultar el contrato API',
  },
  {
    title: 'Eventos',
    to: '/events/',
    description: 'La definición de eventos y su contrato aún están pendientes.',
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
            Consulta los requisitos, las entregas planeadas y los contratos vigentes del servicio Menu/Catálogo.
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

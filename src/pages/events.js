import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function EventsPage() {
  return (
    <Layout title="Events" description="Estado de la documentación de eventos">
      <main className="container margin-vert--lg">
        <h1>Events</h1>
        <p>
          <strong>Estado: pendiente — aún no definido.</strong>
        </p>
        <p>Restaurant Platform aún no publica aquí un contrato de eventos.</p>
        <Link to="/specification/">Documentation</Link>
      </main>
    </Layout>
  );
}

import { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

const COMPONENT_BASE_URL = 'https://cdn.jsdelivr.net/npm/@asyncapi/react-component@3.2.2';
const SCRIPT_URL = `${COMPONENT_BASE_URL}/browser/standalone/index.js`;
const STYLESHEET_URL = `${COMPONENT_BASE_URL}/styles/default.min.css`;
const SCRIPT_ID = 'asyncapi-react-component-script';
const STYLESHEET_ID = 'asyncapi-react-component-styles';
const VIEW_STYLES = `
.asyncapi-view { background: #ffffff; color: #1c1e21; border-radius: 8px; }
.asyncapi-view h1, .asyncapi-view h2, .asyncapi-view h3, .asyncapi-view h4, .asyncapi-view h5, .asyncapi-view h6 { color: #1c1e21; }
.asyncapi-view a { color: #2e8555; }
.asyncapi-view code { background: transparent; border: none; }
`;

let componentPromise;

// Called only from useEffect (browser), never during server-side rendering.
function loadStylesheet() {
  if (document.getElementById(STYLESHEET_ID)) return;
  const link = document.createElement('link');
  link.id = STYLESHEET_ID;
  link.rel = 'stylesheet';
  link.href = STYLESHEET_URL;
  document.head.appendChild(link);
}

// Called only from useEffect (browser), never during server-side rendering.
function loadComponent() {
  if (window.AsyncApiStandalone) return Promise.resolve(window.AsyncApiStandalone);
  if (!componentPromise) {
    componentPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.AsyncApiStandalone) resolve(window.AsyncApiStandalone);
        else reject(new Error('AsyncApiStandalone is not available.'));
      };
      script.onerror = () => reject(new Error(`Failed to load ${SCRIPT_URL}.`));
      document.body.appendChild(script);
    }).catch((error) => {
      componentPromise = undefined;
      document.getElementById(SCRIPT_ID)?.remove();
      throw error;
    });
  }
  return componentPromise;
}

export default function EventsPage() {
  const schemaPath = useBaseUrl('/api/asyncapi.yaml');
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    loadStylesheet();
    loadComponent()
      .then((AsyncApiStandalone) => {
        if (cancelled || !containerRef.current) return;
        AsyncApiStandalone.render(
          {
            schema: { url: new URL(schemaPath, window.location.origin).href },
            config: { show: { sidebar: true } },
          },
          containerRef.current,
        );
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [schemaPath]);

  return (
    <Layout title="Events" description="Contrato de eventos asíncronos del servicio Menu (AsyncAPI)">
      <main className="container margin-vert--lg">
        <h1>Events</h1>
        <p>Contrato AsyncAPI de los eventos asíncronos entre Menu e Inventario.</p>
        {status === 'loading' && <p role="status">Cargando el contrato de eventos…</p>}
        {status === 'error' && (
          <div className="alert alert--danger" role="alert">
            No se pudo cargar la vista del contrato de eventos. El documento está disponible en{' '}
            <a href={schemaPath}>asyncapi.yaml</a>.
          </div>
        )}
        <style>{VIEW_STYLES}</style>
        <div ref={containerRef} className="asyncapi-view" />
      </main>
    </Layout>
  );
}

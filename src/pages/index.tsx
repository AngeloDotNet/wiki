import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

// Landing page with the two macro areas of the site: each one links to the first page of its wiki.
export default function Home(): ReactNode {
  return (
    <Layout title="Documentazione" description="Wiki di Claude Code Kit e Sagre & Eventi">
      <main className="container margin-vert--xl">
        <h1>Documentazione</h1>
        <p>Scegli l'area da consultare.</p>
        <div className="row">
          <div className="col col--6 margin-bottom--lg">
            <h2>Claude Code Kit</h2>
            <p>Regole, plugin e template per Claude Code.</p>
            <Link className="button button--primary" to="/claude-config/intro">Apri</Link>
          </div>
          <div className="col col--6 margin-bottom--lg">
            <h2>Sagre &amp; Eventi</h2>
            <p>API, backend, client e deployment dell'applicazione.</p>
            <Link className="button button--primary" to="/sagreeventi/intro">Apri</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}

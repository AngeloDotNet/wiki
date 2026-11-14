import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {wikis} from '../data/wikis';

// Landing page: one card per wiki, generated from src/data/wikis.ts.
// Each card has a cover image on top, the title and text in the middle and the action at the bottom.
export default function Home(): ReactNode {
  const {withBaseUrl} = useBaseUrlUtils();
  return (
    <Layout title="Documentazione" description="Wiki del sito">
      <main className="container margin-vert--xl">
        <h1>Documentazione</h1>
        <p>Scegli l'area da consultare.</p>
        <div className="row">
          {wikis.map((wiki) => (
            <div key={wiki.id} className="col col--3 margin-bottom--lg home-col">
              <div className="card home-card">
                <img
                  className="card__image home-card__media"
                  src={withBaseUrl(`/${wiki.cover}`)}
                  alt=""
                  width={600}
                  height={200}
                />
                <div className="card__header">
                  <h2>{wiki.title}</h2>
                </div>
                <div className="card__body">
                  <p>{wiki.description}</p>
                </div>
                <div className="card__footer">
                  <Link className="button button--primary button--block" to={wiki.startPath}>Apri</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

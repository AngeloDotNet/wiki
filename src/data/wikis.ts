// Elenco delle wiki del sito. Lo leggono la homepage (src/pages/index.tsx) e il config
// (docusaurus.config.ts): per aggiungere una wiki basta una voce qui, più il file della sidebar
// in sidebars/, la cartella in docs/ e la copertina in static/img/.
// Questo file non importa React né moduli del browser: può essere letto anche dal config Node.

export interface WikiDefinition {
  // Identificativo del plugin docs (univoco) e nome della sidebar esportata dal file in sidebars/.
  id: string;
  sidebarId: string;
  sidebarPath: string;
  // Cartella dei Markdown, relativa alla root del progetto.
  folder: string;
  // Prefisso delle route, per esempio 'claude-config' produce /claude-config/...
  routeBasePath: string;
  // Percorso della prima pagina, mostrato dal pulsante "Apri" della homepage.
  startPath: string;
  // Titolo usato in homepage e nella navbar.
  title: string;
  // Testo breve della card in homepage.
  description: string;
  // Immagine di copertina, relativa a static/.
  cover: string;
}

export const wikis: WikiDefinition[] = [
  {
    id: 'claude-config',
    sidebarId: 'claudeConfigSidebar',
    sidebarPath: './sidebars/claude-config.ts',
    folder: 'docs/claude-config',
    routeBasePath: 'claude-config',
    startPath: '/claude-config/intro',
    title: 'Claude Code Kit',
    description: 'Regole, plugin e template per Claude Code.',
    cover: 'img/home-claude-kit.svg',
  },
  {
    id: 'sagreeventi',
    sidebarId: 'sagreeventiSidebar',
    sidebarPath: './sidebars/sagreeventi.ts',
    folder: 'docs/sagreeventi',
    routeBasePath: 'sagreeventi',
    startPath: '/sagreeventi/intro',
    title: 'Sagre & Eventi',
    description: "API, backend, client e deployment dell'applicazione.",
    cover: 'img/home-sagre.svg',
  },
];

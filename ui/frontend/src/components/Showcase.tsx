import { showcase } from "@/lib/content";
import { company } from "@/lib/mockdata";
import type { Ui } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { AstraAnswerPanel } from "./AstraAnswerPanel";
import { DineAstraConcept, DravyaConcept, TwinConcept } from "./ConceptMockups";
import { MockupFrame } from "./MockupFrame";
import { ShowcaseTabs, type AppDef } from "./ShowcaseTabs";
import {
  AstraAgents,
  AstraCollect,
  AstraConnector,
  AstraSales,
  YantraBrief,
  YantraDashboard,
  YantraMachines,
  YantraVoice,
} from "./ShowcaseViews";

const DEMO_INTERVAL = 5200;

function liveApp(id: "astra" | "yantra", ui: Ui): AppDef {
  const T = showcase;
  if (id === "astra")
    return {
      id: "astra",
      name: T.astra.name,
      tabs: [
        { id: "ask", label: T.astra.tabs.ask, panel: <AstraAnswerPanel ui={ui} /> },
        { id: "collect", label: T.astra.tabs.collect, panel: <AstraCollect /> },
        { id: "sales", label: T.astra.tabs.sales, panel: <AstraSales /> },
        { id: "agents", label: T.astra.tabs.agents, panel: <AstraAgents /> },
        { id: "connector", label: T.astra.tabs.connector, panel: <AstraConnector /> },
      ],
    };
  return {
    id: "yantra",
    name: T.yantra.name,
    tabs: [
      { id: "dashboard", label: T.yantra.tabs.dashboard, panel: <YantraDashboard /> },
      { id: "brief", label: T.yantra.tabs.brief, panel: <YantraBrief /> },
      { id: "machines", label: T.yantra.tabs.machines, panel: <YantraMachines ui={ui} /> },
      { id: "voice", label: T.yantra.tabs.voice, panel: <YantraVoice ui={ui} /> },
    ],
  };
}

/**
 * The window that shows what a product does. Live products (Astra, Yantra) get their
 * real tab structure on sample data and play through the tabs like a demo. Products that
 * are not live get a labelled concept. Returns null for a product with no mockup.
 */
export function ProductDemo({ product, ui, autoplay = true }: { product: Product; ui: Ui; autoplay?: boolean }) {
  const ref = product.mockup?.ref;
  if (!ref) return null;

  if (ref === "astra" || ref === "yantra") {
    const app = liveApp(ref, ui);
    return (
      <MockupFrame kind="sample" title={`${app.name} · ${company}`} ui={ui} flush>
        <ShowcaseTabs
          apps={[app]}
          switchLabel={showcase.switchLabel}
          tabsLabel={showcase.tabsLabel}
          autoplay={
            autoplay
              ? { interval: DEMO_INTERVAL, pauseLabel: showcase.demo.pause, playLabel: showcase.demo.play }
              : undefined
          }
        />
      </MockupFrame>
    );
  }

  return (
    <MockupFrame kind="concept" title={product.name} ui={ui}>
      {ref === "digitalTwin" && <TwinConcept ui={ui} />}
      {ref === "dravya" && <DravyaConcept ui={ui} />}
      {ref === "dineastra" && <DineAstraConcept />}
    </MockupFrame>
  );
}

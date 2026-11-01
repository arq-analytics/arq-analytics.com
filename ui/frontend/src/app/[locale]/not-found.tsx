import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getUi, localePath } from "@/lib/i18n";
import { whatsappPrefillLink } from "@/lib/links";

/** Rendered inside the locale layout. A not-found boundary has no params, so it uses English. */
export default function NotFound() {
  const ui = getUi("en");
  return (
    <div className="container not-found">
      <span className="eyebrow">404</span>
      <h1>{ui.notFound.title}</h1>
      <p>{ui.notFound.text}</p>
      <div className="cta-pair">
        <Link className="arq-primary" href={localePath("en")}>
          {ui.notFound.home}
        </Link>
        <a className="arq-outline" href={whatsappPrefillLink("default")} target="_blank" rel="noopener noreferrer">
          <Icon name="chat" size={18} />
          {ui.notFound.whatsapp}
        </a>
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import { Container } from "@ortaq/components/ui/Section";
import { typography } from "@ortaq/design/typography";

const items = ["mkk", "escrow", "edevlet", "disclosure"] as const;

export function TrustStrip() {
  const { t } = useTranslation();

  return (
    <div className="border-y border-ortaq-border bg-ortaq-bg-alt">
      <Container>
        <p className={`${typography.caption} pt-6`}>{t("trustStrip.intro")}</p>
        <ul className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-ortaq-border">
          {items.map((key) => (
            <li key={key} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <p className={typography.body}>{t(`trustStrip.${key}`)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

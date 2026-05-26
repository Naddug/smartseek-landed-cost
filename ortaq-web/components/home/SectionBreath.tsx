import { EditorialRule } from "@/components/ui/EditorialRule";
import { Container } from "@/components/ui/Section";

/** Quiet chapter break between homepage sections */
export function SectionBreath() {
  return (
    <Container narrow aria-hidden>
      <EditorialRule className="my-2 sm:my-4" />
    </Container>
  );
}

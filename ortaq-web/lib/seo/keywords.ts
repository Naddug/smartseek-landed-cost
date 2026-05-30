/**
 * Turkish keyword clusters, category authority map.
 * Use for content planning and internal linking anchors, not keyword stuffing.
 */

export type KeywordCluster = {
  id: string;
  /** Hub page path */
  hub: string;
  primary: string[];
  secondary: string[];
  /** User fear or motivation this cluster addresses */
  audience: string;
};

export const KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    id: "ortaklik-basics", hub: "/nasil-calisir", primary: ["paya dayalı ortaklık", "ortaklık nasıl olur", "kitle fonlama nedir"], secondary: ["şirkete ortak olmak", "halka açık olmayan şirket ortaklığı"], audience: "Meraklı ama acele etmeyen kullanıcı", }, {
    id: "trust-regulation", hub: "/guven", primary: ["SPK güvenilir mi", "kitle fonlama güvenli mi", "lisanslı platform"], secondary: ["SPK listesi kitle fonlama", "dolandırıcılık nasıl anlaşılır"], audience: "Güven endişesi yüksek, dolandırıcılık korkusu", }, {
    id: "money-safety", hub: "/guven", primary: ["emanet hesabı nedir", "param nereye gider", "MKK kaydı"], secondary: ["para şirkete gider mi", "pay kaydı türkiye"], audience: "Paranın güvenliği konusunda temkinli", }, {
    id: "risk-limits", hub: "/riskler", primary: ["yatırım riskleri", "para kaybeder miyim", "yıllık limit kitle fonlama"], secondary: ["cayma hakkı", "pay satışı ne zaman"], audience: "Acemi yatırımcı, kayıp korkusu", }, {
    id: "comparison", hub: "/sss", primary: ["kitle fonlama vs borsa", "ortaklık vs hisse senedi", "alternatif yatırım"], secondary: ["kripto ortaklık farkı", "gayrimenkul ortaklık farkı"], audience: "Alternatif arayan, karşılaştıran", }, {
    id: "founders", hub: "/sss", primary: ["şirket sermaye artırımı", "kitle fonlama şirket başvurusu"], secondary: ["paya dayalı fonlama şartları"], audience: "Şirket kurucuları", }, {
    id: "terminology", hub: "/sozluk", primary: ["MKK nedir", "bilgi formu nedir", "sermaye artırımı nedir"], secondary: ["izahname", "paya dayalı kampanya"], audience: "Terimleri bilmeyen yeni kullanıcı", },
];

export function clustersForPath(path: string): KeywordCluster[] {
  return KEYWORD_CLUSTERS.filter((c) => c.hub === path);
}

export const media = {
  industrialLine: {
    src: "/media/industrial-line.jpg",
    altTr: "Endüstriyel üretim hattı",
    altEn: "Industrial production line",
    credit: "Unsplash / stok",
    focalPoint: "center 42%",
    aspect: "editorial" as const,
    role: "economy-context" as const,
    mood: "operational",
  },
  warehouse: {
    src: "/media/warehouse.jpg",
    altTr: "Depo ve lojistik alanı",
    altEn: "Warehouse and logistics area",
    credit: "Unsplash / stok",
    focalPoint: "center 55%",
    aspect: "editorial" as const,
    role: "place" as const,
    mood: "grounded",
  },
} as const;

export type MediaKey = keyof typeof media;

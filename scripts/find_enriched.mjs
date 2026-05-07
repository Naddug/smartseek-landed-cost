import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const enrichments = await p.companyEnrichment.findMany({ take: 200, orderBy: { crawledAt: 'desc' } });
console.log('total enrichments sampled:', enrichments.length);
let found = false;
for (const e of enrichments) {
  const sup = await p.supplier.findFirst({
    where: {
      OR: [
        { website: { contains: e.domain, mode: 'insensitive' } },
        { website: { contains: 'www.' + e.domain, mode: 'insensitive' } },
      ],
    },
    select: { slug: true, companyName: true, website: true, verified: true, contactVerified: true },
  });
  if (sup) {
    console.log(JSON.stringify({
      matchDomain: e.domain,
      pagesVisited: e.pagesVisited,
      channels: {
        emails: e.emails?.length || 0,
        phones: e.phones?.length || 0,
        linkedins: e.linkedins?.length || 0,
        addresses: e.addresses?.length || 0,
      },
      supplier: sup,
    }, null, 2));
    found = true;
    break;
  }
}
if (!found) console.log('no overlap found in last 200 enrichments');
await p.$disconnect();

import { useState } from "react";
import { useProfile, useShortlists, useShortlist } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Unlock, ArrowUpRight, MapPin, Star, ShieldCheck, Loader2, Mail } from "lucide-react";
import { Link } from "wouter";
import type { SupplierShortlist } from "@shared/schema";

interface Supplier {
  name: string;
  location: string;
  rating: number;
  moq: string;
  leadTime: string;
  certifications: string[];
  specialties: string[];
  yearsInBusiness: number;
  contactEmail: string;
}

export default function Shortlists() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: shortlists = [], isLoading: shortlistsLoading } = useShortlists();
  const isPro = profile?.plan === 'pro';
  
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [selectedList, setSelectedList] = useState<SupplierShortlist | null>(null);

  const handleViewSuppliers = (list: SupplierShortlist) => {
    setSelectedList(list);
    setSelectedListId(list.id);
  };

  const isLoading = profileLoading || shortlistsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Curated Shortlists</h1>
          <p className="text-muted-foreground">Vetted suppliers by category. Hand-picked by our experts.</p>
        </div>
        {!isPro && (
          <Link href="/billing">
            <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer hover:bg-primary/15 transition-colors">
              <Lock size={16} />
              Upgrade to Pro to access Premium lists <ArrowUpRight size={16} />
            </div>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shortlists.map((list) => {
          const isLocked = list.isPremium && !isPro;
          const suppliers = list.suppliers as Supplier[];
          
          return (
            <Card key={list.id} className={`flex flex-col ${isLocked ? 'opacity-80' : ''} hover:shadow-lg transition-shadow relative overflow-hidden`} data-testid={`card-shortlist-${list.id}`}>
              {isLocked && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <Link href="/billing">
                     <Button>Upgrade to Unlock</Button>
                   </Link>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={list.isPremium ? "default" : "secondary"}>
                    {list.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                  {isLocked ? <Lock size={18} className="text-muted-foreground" /> : <Unlock size={18} className="text-green-500" />}
                </div>
                <CardTitle className="text-xl">{list.title}</CardTitle>
                <div className="text-sm text-muted-foreground font-normal">{list.category}</div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{suppliers?.length || 0}</span> Vetted Suppliers
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isLocked ? "outline" : "default"} 
                  disabled={isLocked}
                  onClick={() => !isLocked && handleViewSuppliers(list)}
                  data-testid={`button-view-${list.id}`}
                >
                  {isLocked ? "Unlock with Pro" : "View Suppliers"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Supplier Details Dialog */}
      <Dialog open={!!selectedList} onOpenChange={(open) => !open && setSelectedList(null)}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">{selectedList?.title}</DialogTitle>
            <DialogDescription>
              Verified supplier list for {selectedList?.category}. Contact suppliers directly or use our agent service.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Certifications</TableHead>
                  <TableHead className="text-right">Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedList?.suppliers as Supplier[] || []).map((supplier, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-xs text-muted-foreground">{supplier.yearsInBusiness} years in business</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {supplier.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{supplier.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.moq}</TableCell>
                    <TableCell>{supplier.leadTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {supplier.certifications.slice(0, 2).map((cert, i) => (
                          <Badge key={i} variant="outline" className="text-xs flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {cert}
                          </Badge>
                        ))}
                        {supplier.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{supplier.certifications.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${supplier.contactEmail}`, '_blank')}>
                        <Mail className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

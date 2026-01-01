import { useState } from "react";
import { useStore, Shortlist } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Unlock, ArrowUpRight, MapPin, Star, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Shortlists() {
  const { user, shortlists } = useStore();
  const isPro = user?.plan === 'pro';
  
  const [selectedList, setSelectedList] = useState<Shortlist | null>(null);

  const handleViewSuppliers = (list: Shortlist) => {
    setSelectedList(list);
  };

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
          
          return (
            <Card key={list.id} className={`flex flex-col ${isLocked ? 'opacity-80' : ''} hover:shadow-lg transition-shadow relative overflow-hidden`}>
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
                  <span className="font-bold text-foreground">{list.itemCount}</span> Vetted Suppliers
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isLocked ? "outline" : "default"} 
                  disabled={isLocked}
                  onClick={() => !isLocked && handleViewSuppliers(list)}
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                  <TableHead>Certifications</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedList?.suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <div>{supplier.name}</div>
                      <div className="text-xs text-muted-foreground">{supplier.priceRange}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {supplier.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.moq}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {supplier.certifications.map((cert: string) => (
                          <Badge key={cert} variant="outline" className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="secondary" className="h-7 text-xs">Contact</Button>
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
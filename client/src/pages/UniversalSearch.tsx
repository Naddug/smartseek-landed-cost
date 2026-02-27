import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Package, Hash, Building2, Globe, TrendingUp, 
  Star, ArrowRight, Clock, X, Loader2, Filter, SlidersHorizontal, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for search suggestions and results
const mockProducts = [
  { id: 1, name: "Bluetooth Wireless Earbuds", category: "Electronics", hsCode: "8518.30", avgPrice: "$12.50", suppliers: 245, trending: true },
  { id: 2, name: "LED Strip Lights RGB", category: "Electronics", hsCode: "9405.40", avgPrice: "$3.80", suppliers: 189, trending: true },
  { id: 3, name: "Portable Power Bank 10000mAh", category: "Electronics", hsCode: "8507.60", avgPrice: "$8.20", suppliers: 312, trending: false },
  { id: 4, name: "Yoga Mat Premium", category: "Sports & Fitness", hsCode: "9506.91", avgPrice: "$5.50", suppliers: 156, trending: false },
  { id: 5, name: "Stainless Steel Water Bottle", category: "Home & Kitchen", hsCode: "7323.93", avgPrice: "$4.20", suppliers: 278, trending: true },
  { id: 6, name: "Smart Watch Fitness Tracker", category: "Electronics", hsCode: "9102.12", avgPrice: "$15.80", suppliers: 198, trending: true },
  { id: 7, name: "Cotton T-Shirt Blank", category: "Apparel", hsCode: "6109.10", avgPrice: "$2.80", suppliers: 456, trending: false },
  { id: 8, name: "Phone Case Silicone", category: "Electronics Accessories", hsCode: "3926.90", avgPrice: "$0.85", suppliers: 523, trending: false },
];

const mockHsCodes = [
  { code: "8518.30", description: "Headphones and earphones, whether or not combined with microphone", dutyRate: "4.9%", category: "Electronics" },
  { code: "9405.40", description: "Other electric lamps and lighting fittings", dutyRate: "3.9%", category: "Lighting" },
  { code: "8507.60", description: "Lithium-ion batteries", dutyRate: "3.4%", category: "Batteries" },
  { code: "6109.10", description: "T-shirts, singlets and other vests, of cotton", dutyRate: "16.5%", category: "Apparel" },
  { code: "7323.93", description: "Table, kitchen articles of stainless steel", dutyRate: "5.3%", category: "Kitchenware" },
  { code: "9102.12", description: "Wrist-watches, electrically operated", dutyRate: "6.4%", category: "Watches" },
];

const mockSuppliers = [
  { id: 1, name: "Shenzhen TechPro Electronics", country: "China", verified: true, rating: 4.8, products: 1245, minOrder: "$500" },
  { id: 2, name: "Guangzhou Smart Devices Co.", country: "China", verified: true, rating: 4.7, products: 892, minOrder: "$300" },
  { id: 3, name: "Vietnam Manufacturing Group", country: "Vietnam", verified: true, rating: 4.6, products: 567, minOrder: "$1000" },
  { id: 4, name: "Bangkok Trading Corporation", country: "Thailand", verified: false, rating: 4.4, products: 345, minOrder: "$500" },
  { id: 5, name: "Mumbai Industrial Supplies", country: "India", verified: true, rating: 4.5, products: 678, minOrder: "$800" },
];

const recentSearches = [
  "bluetooth earbuds",
  "LED lights wholesale",
  "power bank supplier",
  "8518.30",
];

const trendingSearches = [
  "wireless earbuds",
  "smart watch",
  "LED strip lights",
  "phone accessories",
  "yoga equipment",
  "stainless steel bottles",
];

export default function UniversalSearch() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<{
    products: typeof mockProducts;
    hsCodes: typeof mockHsCodes;
    suppliers: typeof mockSuppliers;
  }>({ products: [], hsCodes: [], suppliers: [] });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  const suggestions = query.length > 1 ? [
    ...mockProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3).map(p => ({ type: 'product', text: p.name, icon: Package })),
    ...mockHsCodes.filter(h => h.code.includes(query) || h.description.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map(h => ({ type: 'hs', text: `${h.code} - ${h.description.slice(0, 40)}...`, icon: Hash })),
    ...mockSuppliers.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map(s => ({ type: 'supplier', text: s.name, icon: Building2 })),
  ] : [];

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    setQuery(searchQuery);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const q = searchQuery.toLowerCase();
    setResults({
      products: mockProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.hsCode.includes(q)
      ),
      hsCodes: mockHsCodes.filter(h => 
        h.code.includes(q) || 
        h.description.toLowerCase().includes(q)
      ),
      suppliers: mockSuppliers.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      ),
    });
    
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleExport = () => {
    const csvContent = [
      "Type,Name,Category,Code,Price/Rate,Country",
      ...results.products.map(p => `Product,"${p.name}",${p.category},${p.hsCode},${p.avgPrice},`),
      ...results.hsCodes.map(h => `HS Code,"${h.description}",${h.category},${h.code},${h.dutyRate},`),
      ...results.suppliers.map(s => `Supplier,"${s.name}",,,,${s.country}`),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-results-${query.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Exported ${totalResults} results to CSV`,
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalResults = results.products.length + results.hsCodes.length + results.suppliers.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Universal Search</h1>
        <p className="text-muted-foreground">
          Search products, HS codes, suppliers, and trade data across the platform
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, HS codes, suppliers..."
            className="pl-12 pr-24 h-14 text-lg bg-white text-gray-900 placeholder:text-gray-500"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(query.length > 0)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            data-testid="input-search"
          />
          {query && (
            <button 
              className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              onClick={() => { setQuery(""); setShowSuggestions(false); }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <Button 
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => handleSearch()}
            disabled={isSearching}
            data-testid="button-search"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                onClick={() => handleSearch(suggestion.text.split(' - ')[0])}
              >
                <suggestion.icon className="w-4 h-4 text-muted-foreground" />
                <span>{suggestion.text}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {suggestion.type === 'product' ? 'Product' : suggestion.type === 'hs' ? 'HS Code' : 'Supplier'}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions / Initial State */}
      {!hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSearch(term)}
                    data-testid={`button-recent-${i}`}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, i) => (
                  <Button 
                    key={i} 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleSearch(term)}
                    data-testid={`button-trending-${i}`}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Search Categories */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Browse Categories</CardTitle>
              <CardDescription>Explore popular product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Electronics", icon: "📱", count: "10M+ suppliers" },
                  { name: "Apparel", icon: "👕", count: "1.8M products" },
                  { name: "Home & Garden", icon: "🏠", count: "980K products" },
                  { name: "Sports & Fitness", icon: "⚽", count: "560K products" },
                  { name: "Beauty & Health", icon: "💄", count: "720K products" },
                  { name: "Auto Parts", icon: "🚗", count: "450K products" },
                  { name: "Industrial", icon: "🏭", count: "890K products" },
                  { name: "Food & Beverage", icon: "🍔", count: "320K products" },
                ].map((cat, i) => (
                  <button
                    key={i}
                    className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    onClick={() => handleSearch(cat.name)}
                    data-testid={`button-category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-muted-foreground">{cat.count}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{totalResults}</span> results for "{query}"
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" data-testid="button-filters">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="products">Products ({results.products.length})</TabsTrigger>
              <TabsTrigger value="hscodes">HS Codes ({results.hsCodes.length})</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers ({results.suppliers.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 space-y-6">
              {/* Products Section */}
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Products
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('products')}>
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.products.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* HS Codes Section */}
              {results.hsCodes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      HS Codes
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('hscodes')}>
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {results.hsCodes.slice(0, 3).map((hs) => (
                      <HsCodeCard key={hs.code} hsCode={hs} />
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers Section */}
              {results.suppliers.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Suppliers
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('suppliers')}>
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.suppliers.slice(0, 4).map((supplier) => (
                      <SupplierCard key={supplier.id} supplier={supplier} />
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <Card className="p-8 text-center">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse categories
                  </p>
                  <Button variant="outline" onClick={() => setHasSearched(false)}>
                    Browse Categories
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hscodes" className="mt-6">
              <div className="space-y-2">
                {results.hsCodes.map((hs) => (
                  <HsCodeCard key={hs.code} hsCode={hs} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: typeof mockProducts[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-product-${product.id}`}>
      <CardContent className="pt-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium truncate">{product.name}</h4>
              {product.trending && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 flex-shrink-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{product.category}</div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>HS: <span className="font-mono">{product.hsCode}</span></span>
              <span>Avg: <span className="font-semibold text-primary">{product.avgPrice}</span></span>
              <span>{product.suppliers} suppliers</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Link href="/smart-finder" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Get Quote
            </Button>
          </Link>
          <Link href="/customs-calculator">
            <Button variant="ghost" size="sm">
              Calc Duty
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function HsCodeCard({ hsCode }: { hsCode: typeof mockHsCodes[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-hs-${hsCode.code}`}>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Hash className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{hsCode.code}</span>
              <Badge variant="secondary">{hsCode.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{hsCode.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm text-muted-foreground">Duty Rate</div>
            <div className="font-semibold text-primary">{hsCode.dutyRate}</div>
          </div>
          <Link href="/customs-calculator">
            <Button variant="outline" size="sm">
              Calculate
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SupplierCard({ supplier }: { supplier: typeof mockSuppliers[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-supplier-${supplier.id}`}>
      <CardContent className="pt-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">{supplier.name}</h4>
              {supplier.verified && (
                <Badge className="bg-green-500 flex-shrink-0">Verified</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Globe className="w-3 h-3" />
              {supplier.country}
              <span className="flex items-center gap-1 ml-2">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {supplier.rating}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>{supplier.products} products</span>
              <span>Min order: {supplier.minOrder}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" className="flex-1">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

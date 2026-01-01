import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, Percent } from "lucide-react";

export default function Tools() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">Sourcing Tools</h1>
        <p className="text-muted-foreground">Calculators and utilities for better buying decisions.</p>
      </div>

      <Tabs defaultValue="landed-cost" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="landed-cost">Landed Cost</TabsTrigger>
          <TabsTrigger value="margin">Margin Calc</TabsTrigger>
        </TabsList>
        
        <TabsContent value="landed-cost" className="mt-6">
          <LandedCostCalculator />
        </TabsContent>
        
        <TabsContent value="margin" className="mt-6">
          <MarginCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LandedCostCalculator() {
  const [values, setValues] = useState({ unitCost: 10, quantity: 100, shipping: 500, duty: 5 });
  
  const subtotal = values.unitCost * values.quantity;
  const dutyCost = subtotal * (values.duty / 100);
  const totalCost = subtotal + values.shipping + dutyCost;
  const costPerUnit = totalCost / values.quantity;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" /> 
          Landed Cost Calculator
        </CardTitle>
        <CardDescription>Estimate the total cost of goods delivered to your door.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unit Cost ($)</Label>
            <Input type="number" value={values.unitCost} onChange={(e) => setValues({...values, unitCost: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" value={values.quantity} onChange={(e) => setValues({...values, quantity: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label>Shipping Total ($)</Label>
            <Input type="number" value={values.shipping} onChange={(e) => setValues({...values, shipping: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label>Duty Rate (%)</Label>
            <Input type="number" value={values.duty} onChange={(e) => setValues({...values, duty: Number(e.target.value)})} />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Landed Cost</div>
            <div className="text-3xl font-bold">${totalCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Cost Per Unit</div>
            <div className="text-3xl font-bold text-primary">${costPerUnit.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MarginCalculator() {
  const [values, setValues] = useState({ cost: 15, price: 45 });
  
  const profit = values.price - values.cost;
  const margin = (profit / values.price) * 100;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-green-500" /> 
          Profit Margin Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Unit Cost ($)</Label>
            <Input type="number" value={values.cost} onChange={(e) => setValues({...values, cost: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label>Retail Price ($)</Label>
            <Input type="number" value={values.price} onChange={(e) => setValues({...values, price: Number(e.target.value)})} />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Profit Per Unit</div>
            <div className="text-3xl font-bold text-green-600">${profit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Gross Margin</div>
            <div className="text-3xl font-bold">{margin.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter as DialogFooterPrimitive,
  DialogClose,
} from '@/components/ui/dialog';
const PackageForm = ({ packageData, onSubmit, onCancel }) => {
  const [name, setName] = useState(packageData?.name || '');
  const [price, setPrice] = useState(packageData?.price || '');
  const [pricePrefix, setPricePrefix] = useState(
    packageData?.pricePrefix || '',
  );
  const [billing, setBilling] = useState(packageData?.billing || 'monthly');
  const [category, setCategory] = useState(packageData?.category || '');
  const [description, setDescription] = useState(
    packageData?.description || '',
  );
  const [bestFor, setBestFor] = useState(packageData?.bestFor || '');
  const [badge, setBadge] = useState(packageData?.badge || '');
  const [ctaText, setCtaText] = useState(packageData?.ctaText || '');
  const [features, setFeatures] = useState(
    packageData?.features?.join(', ') || '',
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !category || !description) {
      alert(
        'Please fill in all required fields: Name, Price, Category and Description.',
      );
      return;
    }

    const payload = {
      name,
      price: Number(price),
      pricePrefix,
      billing,
      category,
      description,
      bestFor,
      badge,
      ctaText,
      features: features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      isActive: true,
    };

    if (packageData?.id) {
      payload.id = packageData.id;
    }

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      {/* Package Name */}
      <div>
        <Label htmlFor="package-name">
          Package Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="package-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Growth Care"
          required
        />
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="package-price">
          Price (ZAR) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="package-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="1499"
          required
        />
      </div>

      {/* Price Prefix */}
      <div>
        <Label>Price Prefix</Label>
        <Select value={pricePrefix} onValueChange={setPricePrefix}>
          <SelectTrigger>
            <SelectValue placeholder="Select price prefix" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="From">From</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Billing Type */}
      <div>
        <Label>Billing Type</Label>
        <Select value={billing} onValueChange={setBilling}>
          <SelectTrigger>
            <SelectValue placeholder="Select billing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="once-off">Once-Off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <Label>
          Package Category <span className="text-destructive">*</span>
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website-care">Website Care</SelectItem>
            <SelectItem value="ecommerce">Ecommerce</SelectItem>
            <SelectItem value="once-off">Once-Off Website</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">
          Short Description <span className="text-destructive">*</span>
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Most popular for service businesses"
          required
        />
      </div>

      {/* Best For */}
      <div>
        <Label htmlFor="best-for">Best For</Label>
        <Textarea
          id="best-for"
          value={bestFor}
          onChange={(e) => setBestFor(e.target.value)}
          placeholder="Best for businesses that want long-term support and lead generation."
        />
      </div>

      {/* Badge */}
      <div>
        <Label>Badge</Label>
        <Select value={badge} onValueChange={setBadge}>
          <SelectTrigger>
            <SelectValue placeholder="Select badge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="MOST POPULAR">MOST POPULAR</SelectItem>
            <SelectItem value="NEW">NEW</SelectItem>
            <SelectItem value="FEATURED">FEATURED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CTA Text */}
      <div>
        <Label htmlFor="cta-text">Button Text</Label>
        <Input
          id="cta-text"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          placeholder="Choose Growth Care"
        />
      </div>

      {/* Features */}
      <div>
        <Label htmlFor="features">Features (comma separated)</Label>
        <Textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="Priority support, Monthly updates, SEO setup"
        />
      </div>

      <DialogFooterPrimitive className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>

        <Button type="submit">
          {packageData ? 'Update Package' : 'Add Package'}
        </Button>
      </DialogFooterPrimitive>
    </form>
  );
};

export default PackageForm;

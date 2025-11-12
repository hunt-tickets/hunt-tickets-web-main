"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Image as ImageIcon,
  CreditCard,
  MapPin,
  Calendar,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";

export function EventConfigContent() {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    location: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
  });

  const [paymentConfig, setPaymentConfig] = useState({
    stripKey: "",
    mercadopagoKey: "",
    bankTransfer: false,
    paypalEmail: "",
  });

  const [images, setImages] = useState({
    banner: null,
    logo: null,
  });

  const [showKeys, setShowKeys] = useState({
    stripe: false,
    mercadopago: false,
  });

  const [activeTab, setActiveTab] = useState("information");

  const tabs = [
    { id: "information", label: "Información", icon: Settings },
    { id: "images", label: "Imágenes", icon: ImageIcon },
    { id: "payment", label: "Pagos", icon: CreditCard },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentConfig(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: "banner" | "logo") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => ({
          ...prev,
          [imageType]: event.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConfig = (section: string) => {
    console.log(`Guardando configuración de ${section}`, {
      formData,
      paymentConfig,
      images
    });
    // TODO: Implement API call to save configuration
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Information Section */}
      {activeTab === "information" && (
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Información del Evento</CardTitle>
            <CardDescription>Configura los detalles básicos de tu evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="eventName">Nombre del Evento</Label>
              <Input
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="ej. Festival de Música 2024"
                className="rounded-lg bg-white/5 border-white/10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe tu evento, artistas, atracciones..."
                className="rounded-lg bg-white/5 border-white/10 min-h-[120px]"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="ej. Av. Principal 123"
                  className="rounded-lg bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="ej. Bogotá"
                  className="rounded-lg bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="ej. Colombia"
                  className="rounded-lg bg-white/5 border-white/10"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Inicio
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="rounded-lg bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Fin
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="rounded-lg bg-white/5 border-white/10"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => handleSaveConfig("información")}
                className="rounded-lg"
              >
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images Section */}
      {activeTab === "images" && (
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Imágenes del Evento</CardTitle>
            <CardDescription>Sube el banner y logo de tu evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Banner Image */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Banner Principal
              </Label>
              <p className="text-xs text-white/50">Recomendado: 1920x600px, máximo 5MB</p>

              {images.banner ? (
                <div className="relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={images.banner as string}
                    alt="Banner preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setImages(prev => ({ ...prev, banner: null }))}
                    className="absolute top-2 right-2 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-white/40 mb-2" />
                    <p className="text-sm text-white/60">Haz clic o arrastra una imagen</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "banner")}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Logo Image */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Logo
              </Label>
              <p className="text-xs text-white/50">Recomendado: 500x500px, máximo 2MB</p>

              {images.logo ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={images.logo as string}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setImages(prev => ({ ...prev, logo: null }))}
                    className="absolute top-1 right-1 rounded-lg h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 text-white/40 mb-1" />
                    <p className="text-xs text-white/60 text-center">Subir Logo</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "logo")}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                onClick={() => handleSaveConfig("imágenes")}
                className="rounded-lg"
              >
                Guardar Imágenes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Section */}
      {activeTab === "payment" && (
        <Card className="bg-white/[0.02] border-white/5">
          <CardHeader>
            <CardTitle>Configuración de Pagos</CardTitle>
            <CardDescription>Configura los métodos de pago para tu evento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stripe */}
            <div className="space-y-3 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Stripe</Label>
                  <p className="text-xs text-white/50">Pasarela de pago internacional</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeKey" className="text-sm">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="stripeKey"
                    name="stripKey"
                    type={showKeys.stripe ? "text" : "password"}
                    value={paymentConfig.stripKey}
                    onChange={handlePaymentChange}
                    placeholder="sk_live_..."
                    className="rounded-lg bg-white/5 border-white/10 flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeys(prev => ({ ...prev, stripe: !prev.stripe }))}
                    className="rounded-lg"
                  >
                    {showKeys.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mercado Pago */}
            <div className="space-y-3 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Mercado Pago</Label>
                  <p className="text-xs text-white/50">Pasarela popular en Latinoamérica</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mercadopagoKey" className="text-sm">Access Token</Label>
                <div className="flex gap-2">
                  <Input
                    id="mercadopagoKey"
                    name="mercadopagoKey"
                    type={showKeys.mercadopago ? "text" : "password"}
                    value={paymentConfig.mercadopagoKey}
                    onChange={handlePaymentChange}
                    placeholder="APP_USR-..."
                    className="rounded-lg bg-white/5 border-white/10 flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeys(prev => ({ ...prev, mercadopago: !prev.mercadopago }))}
                    className="rounded-lg"
                  >
                    {showKeys.mercadopago ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="space-y-3 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Transferencia Bancaria</Label>
                  <p className="text-xs text-white/50">Aceptar transferencias directas</p>
                </div>
                <input
                  type="checkbox"
                  name="bankTransfer"
                  checked={paymentConfig.bankTransfer}
                  onChange={handlePaymentChange}
                  className="h-4 w-4 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* PayPal */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">PayPal</Label>
                <p className="text-xs text-white/50">Email de cuenta PayPal</p>
              </div>
              <Input
                id="paypalEmail"
                name="paypalEmail"
                type="email"
                value={paymentConfig.paypalEmail}
                onChange={handlePaymentChange}
                placeholder="tu@email.com"
                className="rounded-lg bg-white/5 border-white/10"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                onClick={() => handleSaveConfig("pagos")}
                className="rounded-lg"
              >
                Guardar Configuración de Pagos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

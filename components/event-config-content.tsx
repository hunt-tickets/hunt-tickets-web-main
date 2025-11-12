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
  EyeOff,
  DollarSign,
  Percent
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
    mercadopagoKey: "",
  });

  const [huntCosts, setHuntCosts] = useState({
    commissionPercentage: 8,
    costPerTicket: 500,
    description: "Comisión de Hunt por venta de tickets",
  });

  const [images, setImages] = useState({
    banner: null,
    logo: null,
  });

  const [showKeys, setShowKeys] = useState({
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
    const { name, value } = e.target;
    setPaymentConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHuntCostsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHuntCosts(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
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
      huntCosts,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Mercado Pago */}
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Mercado Pago
              </CardTitle>
              <CardDescription>Conecta tu cuenta de Mercado Pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-white/60">
                  Para obtener tu Access Token, visita tu cuenta de Mercado Pago en Configuración → Credenciales → Producción
                </p>
              </div>

              <Button
                onClick={() => handleSaveConfig("mercado-pago")}
                className="w-full rounded-lg"
              >
                Guardar Mercado Pago
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Hunt Costs */}
          <Card className="bg-white/[0.02] border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Costos de Hunt
              </CardTitle>
              <CardDescription>Comisión y costos por ticket</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Commission Percentage */}
              <div className="space-y-2">
                <Label htmlFor="commissionPercentage" className="text-sm flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Porcentaje de Comisión
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="commissionPercentage"
                    name="commissionPercentage"
                    type="number"
                    value={huntCosts.commissionPercentage}
                    onChange={handleHuntCostsChange}
                    placeholder="8"
                    className="rounded-lg bg-white/5 border-white/10 flex-1"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="flex items-center px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60">
                    %
                  </span>
                </div>
              </div>

              {/* Cost Per Ticket */}
              <div className="space-y-2">
                <Label htmlFor="costPerTicket" className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Costo por Ticket
                </Label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60">
                    $
                  </span>
                  <Input
                    id="costPerTicket"
                    name="costPerTicket"
                    type="number"
                    value={huntCosts.costPerTicket}
                    onChange={handleHuntCostsChange}
                    placeholder="500"
                    className="rounded-lg bg-white/5 border-white/10 flex-1"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={huntCosts.description}
                  onChange={handleHuntCostsChange}
                  placeholder="Descripción de los costos"
                  className="rounded-lg bg-white/5 border-white/10 min-h-[80px] text-sm"
                />
              </div>

              {/* Summary */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Comisión:</span>
                  <span className="text-white font-medium">{huntCosts.commissionPercentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Costo por ticket:</span>
                  <span className="text-white font-medium">${huntCosts.costPerTicket.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSaveConfig("costos-hunt")}
                className="w-full rounded-lg"
              >
                Guardar Costos
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

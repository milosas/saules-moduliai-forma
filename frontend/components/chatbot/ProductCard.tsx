"use client";

import type { Product } from "@/lib/chatbot-tools";

interface ProductCardProps {
  product: Product;
}

const TYPE_IMAGES: Record<string, string> = {
  modulis: "/products/solar-panel.svg",
  inverteris: "/products/inverter.svg",
  kaupiklis: "/products/battery.svg",
  "ev stotele": "/products/ev-charger.svg",
};

export default function ProductCard({ product }: ProductCardProps) {
  const getSpecLine = () => {
    switch (product.tipas?.toLowerCase()) {
      case "modulis":
        return `${product.galia}W | ${product.efektyvumas || "–"}% efektyvumas`;
      case "inverteris":
        return `${product.ac_galia_kw || product.galia} kW | ${product.faziskumas || "–"} | ${product.mppt_kiekis || "–"} MPPT`;
      case "kaupiklis":
        return `${product.talpa_kwh || "–"} kWh | ${product.max_iskrovimo_galia_kw || "–"} kW`;
      case "ev stotele":
        return `${product.galia / 1000} kW | ${product.jungtis || "Type 2"}`;
      default:
        return `${product.galia}W`;
    }
  };

  const getTypeLabel = () => {
    switch (product.tipas?.toLowerCase()) {
      case "modulis": return "Saulės modulis";
      case "inverteris": return "Inverteris";
      case "kaupiklis": return "Kaupiklis";
      case "ev stotele": return "EV stotelė";
      default: return product.tipas;
    }
  };

  const imageUrl = product.nuotrauka_url || TYPE_IMAGES[product.tipas?.toLowerCase()] || TYPE_IMAGES["modulis"];

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-28 bg-gradient-to-br from-[#f0f4ff] to-[#e8f0ff] flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt={`${product.gamintojas} ${product.modelis}`}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            const fallback = TYPE_IMAGES[product.tipas?.toLowerCase()];
            if (fallback && img.src !== fallback) {
              img.src = fallback;
            }
          }}
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] bg-[#e8f0ff] text-[#012f7a] px-1.5 py-0.5 rounded font-medium">{getTypeLabel()}</span>
          {product.technologija && (
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{product.technologija}</span>
          )}
        </div>
        <div className="font-semibold text-sm text-[#001959]">
          {product.gamintojas} {product.modelis}
        </div>
        <div className="text-xs text-gray-600 mt-1">{getSpecLine()}</div>
        {product.pastabos && (
          <div className="text-[11px] text-gray-400 mt-1 line-clamp-1">{product.pastabos}</div>
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className="text-[#fd6d15] font-bold text-sm">
            €{product.kaina_eur}
          </span>
          <span className="text-xs text-gray-400">
            Garantija: {product.garantija_metu} m.
          </span>
        </div>
      </div>
    </div>
  );
}

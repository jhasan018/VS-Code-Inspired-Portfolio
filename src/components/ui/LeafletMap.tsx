"use client";

import "leaflet/dist/leaflet.css";

import { divIcon } from "leaflet";
import { GraduationCap, Hospital, TrainFront } from "lucide-react";
import { MapContainer, Marker, Polygon, ScaleControl, TileLayer, Tooltip } from "react-leaflet";

const center: [number, number] = [23.8173, 90.3682];

// A visual neighborhood focus, not an administrative survey boundary.
const mirpurElevenFocus: [number, number][] = [
  [23.8252, 90.3625],
  [23.8246, 90.3802],
  [23.8105, 90.3791],
  [23.8132, 90.3607],
];

type PoiType = "metro" | "hospital" | "school";

const poiSvg: Record<PoiType, string> = {
  metro: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="15" rx="3"/><path d="M8 8h8M9 14h.01M15 14h.01M8 21l2-3M16 21l-2-3"/></svg>',
  hospital: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/></svg>',
  school: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11.5V17c3 2.5 9 2.5 12 0v-5.5M22 9v6"/></svg>',
};

function createPoiIcon(type: PoiType, color: string) {
  return divIcon({
    className: "map-poi-div-icon",
    html: `<span class="map-poi-icon" style="--poi-color:${color}">${poiSvg[type]}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

const landmarks: Array<{
  name: string;
  type: PoiType;
  position: [number, number];
  color: string;
  direction: "top" | "left" | "right";
  offset: [number, number];
}> = [
  {
    name: "মিরপুর–১১ মেট্রো স্টেশন",
    type: "metro",
    position: [23.81913, 90.36529],
    color: "#1746b0",
    direction: "left",
    offset: [-15, 0],
  },
  {
    name: "ইসলামী ব্যাংক হাসপাতাল",
    type: "hospital",
    position: [23.81951, 90.36549],
    color: "#c62d2d",
    direction: "right",
    offset: [15, 0],
  },
  {
    name: "মিরপুর বাংলা উচ্চ বিদ্যালয় ও কলেজ",
    type: "school",
    position: [23.8145, 90.3674],
    color: "#6b1d73",
    direction: "top",
    offset: [0, -15],
  },
];

export default function LeafletMap() {
  return (
    <div
      className="grid w-full bg-[#eef1eb] lg:grid-cols-[minmax(0,1fr)_290px]"
      role="region"
      aria-label="মিরপুর সেকশন ১১, ঢাকার ইন্টার‌্যাক্টিভ মানচিত্র"
    >
      <div className="relative h-screen min-w-0">
        <MapContainer
          center={center}
          zoom={16}
          minZoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ScaleControl position="bottomleft" imperial={false} />

          <Polygon
            positions={mirpurElevenFocus}
            pathOptions={{
              color: "#e33232",
              weight: 3,
              dashArray: "9 7",
              fillColor: "#f7ca68",
              fillOpacity: 0.22,
            }}
          >
            <Tooltip permanent direction="center" className="mirpur-area-label">
              <span>মিরপুর সেকশন ১১</span>
              <small>ঢাকা ১২১৬</small>
            </Tooltip>
          </Polygon>

          {landmarks.map((landmark) => (
            <Marker
              key={landmark.name}
              position={landmark.position}
              icon={createPoiIcon(landmark.type, landmark.color)}
            >
              <Tooltip permanent direction={landmark.direction} offset={landmark.offset} className="map-poi-label">
                {landmark.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute left-3 top-3 z-[500] grid h-[72px] w-[52px] place-items-center rounded-md border border-slate-900/25 bg-white/95 shadow-md sm:left-4 sm:top-4">
          <span className="absolute top-1.5 text-[9px] font-bold text-slate-800">উত্তর</span>
          <span className="mt-3 block h-0 w-0 border-x-[13px] border-b-[31px] border-x-transparent border-b-slate-950" />
        </div>
      </div>

      <aside className="border-t border-slate-300 bg-[#fbfaf6] text-slate-800 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
        <header className="border-b border-slate-300 px-5 py-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#173778]">
            গবেষণা এলাকা মানচিত্র
          </p>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-[#b42318]">মিরপুর সেকশন ১১</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
            ঢাকা উত্তর · বাংলাদেশ
          </p>
        </header>

        <section aria-labelledby="map-legend-title" className="border-b border-slate-300">
          <h4 id="map-legend-title" className="bg-[#173778] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
            চিহ্নসমূহ
          </h4>
          <ul className="space-y-3 px-5 py-4 text-xs font-medium">
            <li className="flex items-center gap-3">
              <span className="w-8 border-t-[3px] border-dashed border-[#e33232]" aria-hidden="true" />
              মিরপুর–১১ কেন্দ্রিক এলাকার সীমা
            </li>
            <li className="flex items-center gap-3">
              <span className="h-4 w-8 border border-[#e3aa33] bg-[#f7ca68]/40" aria-hidden="true" />
              চিহ্নিত কেন্দ্রিক এলাকা
            </li>
            <li className="flex items-center gap-3">
              <span className="map-legend-icon map-legend-metro" aria-hidden="true"><TrainFront /></span>
              মেট্রো স্টেশন
            </li>
            <li className="flex items-center gap-3">
              <span className="map-legend-icon map-legend-hospital" aria-hidden="true"><Hospital /></span>
              হাসপাতাল
            </li>
            <li className="flex items-center gap-3">
              <span className="map-legend-icon map-legend-school" aria-hidden="true"><GraduationCap /></span>
              শিক্ষা প্রতিষ্ঠান
            </li>
            <li className="flex items-center gap-3">
              <span className="h-3 w-8 bg-[linear-gradient(90deg,#d6d3d1_0_35%,#fff_35%_65%,#d6d3d1_65%)]" aria-hidden="true" />
              ওপেনস্ট্রিটম্যাপের মূল তথ্য
            </li>
          </ul>
        </section>

        <section aria-labelledby="map-info-title" className="border-b border-slate-300">
          <h4 id="map-info-title" className="bg-[#173778] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
            মানচিত্রের তথ্য
          </h4>
          <dl className="grid grid-cols-[78px_1fr] gap-x-3 gap-y-2 px-5 py-4 text-[11px] leading-relaxed">
            <dt className="font-bold text-slate-500">স্থানাঙ্ক</dt>
            <dd>২৩.৮১৭৯৩° উত্তর, ৯০.৩৭২১৪° পূর্ব</dd>
            <dt className="font-bold text-slate-500">প্রক্ষেপণ</dt>
            <dd>ওয়েব মার্কেটর · EPSG:3857</dd>
            <dt className="font-bold text-slate-500">তথ্যসূত্র</dt>
            <dd>ওপেনস্ট্রিটম্যাপ অবদানকারীগণ</dd>
            <dt className="font-bold text-slate-500">উদ্দেশ্য</dt>
            <dd>অবস্থান নির্দেশনা</dd>
          </dl>
        </section>

        <section aria-labelledby="location-context-title">
          <h4 id="location-context-title" className="bg-[#173778] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
            অবস্থানের পরিধি
          </h4>
          <ol className="flex flex-wrap items-center gap-1.5 px-5 py-4 text-[11px] font-semibold">
            <li className="rounded-full border border-slate-300 bg-white px-2.5 py-1">বাংলাদেশ</li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="rounded-full border border-slate-300 bg-white px-2.5 py-1">ঢাকা</li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="rounded-full bg-[#b42318] px-2.5 py-1 text-white">মিরপুর–১১</li>
          </ol>
          <p className="px-5 pb-5 text-[10px] leading-relaxed text-slate-500">
            ড্যাশযুক্ত রেখাটি কেবল দৃশ্যমান নির্দেশনার জন্য; এটি কোনো সরকারি জরিপভিত্তিক প্রশাসনিক সীমানা নয়।
          </p>
        </section>
      </aside>
    </div>
  );
}

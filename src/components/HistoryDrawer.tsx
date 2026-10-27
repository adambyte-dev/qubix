"use client";

import { HistoryItem } from "@/types";

interface HistoryDrawerProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

export default function HistoryDrawer({ history, onSelect, onClear }: HistoryDrawerProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl p-5 brutal-border-thick brutal-shadow mt-8">
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD028] brutal-border"></span>
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Riwayat Unduhan Terakhir ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] font-bold text-neutral-500 hover:text-red-600 transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 bg-[#FAF9F5] hover:bg-[#FFFDEB] rounded-xl brutal-border transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-10 h-10 rounded-lg brutal-border object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg brutal-border bg-neutral-200 flex items-center justify-center font-black text-xs shrink-0">
                  {item.platform.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-black text-black truncate group-hover:underline">
                  {item.title}
                </p>
                <span className="text-[10px] font-bold text-neutral-400 uppercase">
                  {item.platform}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect(item.url)}
              className="px-2.5 py-1 bg-[#FFD028] rounded-md brutal-border text-[11px] font-black shrink-0 hover:bg-[#ffe033]"
            >
              Unduh Lagi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

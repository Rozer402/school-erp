import Highlight from "./Highlight";

import { type CommandItem } from "../utils/search";

export default function SearchResults({
  groups,
  selected,
  query,
  onSelect,
  onAction,
}: {
  groups: Array<{ key: string; label: string; items: CommandItem[] }>;
  selected: { group: string; idx: number } | null;
  query: string;
  onSelect: (group: string, idx: number) => void;
  onAction: (item: CommandItem) => void;
}) {
  return (
    <div className="max-h-96 overflow-y-auto p-2">
      {groups.every((g) => g.items.length === 0) ? (
        <div className="text-center text-gray-400 py-8">
          No results found.
          <br />
          <span className="text-xs">
            Try searching {"fees"} or {"timetable"}
          </span>
        </div>
      ) : (
        groups.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.key} className="mb-4">
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-2 mb-1 uppercase tracking-widest">
                  {group.label}
                </div>
                <ul>
                  {group.items.map((item, idx) => {
                    const isActive =
                      selected &&
                      selected.group === group.key &&
                      selected.idx === idx;
                    return (
                      <li
                        key={item.label + idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer select-none transition-colors ${isActive ? "bg-blue-600 text-white" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                        onMouseEnter={() => onSelect(group.key, idx)}
                        onClick={() => onAction(item)}
                      >
                        {item.icon && (
                          <span className="text-xl mr-2">{item.icon}</span>
                        )}
                        <span>
                          <Highlight text={item.label} query={query} />
                        </span>
                        {item.meta && (
                          <span className="ml-auto text-xs text-zinc-400">
                            <Highlight text={item.meta} query={query} />
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
        )
      )}
    </div>
  );
}

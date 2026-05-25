import React from 'react';
import { SearchResultItem } from './SearchResultItem';

export const SearchCategoryGroup = ({
  group,
  flatOffset,
  selectedIndex,
  onSelect,
  onHover,
}) => {
  const Icon = group.icon;

  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-2 px-2 py-1.5 sticky top-0 bg-background/80 backdrop-blur-sm z-[1]">
        <Icon className="w-3 h-3 text-muted" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
          {group.label}
        </span>
        <span className="text-[9px] font-mono text-subtle ml-auto">{group.items.length}</span>
      </div>
      <div className="space-y-0.5">
        {group.items.map((item, i) => {
          const flatIndex = flatOffset + i;
          return (
            <SearchResultItem
              key={item.id}
              item={item}
              index={i}
              selected={selectedIndex === flatIndex}
              onSelect={onSelect}
              onHover={onHover}
            />
          );
        })}
      </div>
    </div>
  );
};

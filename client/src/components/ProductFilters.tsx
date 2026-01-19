import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { ProductOwner, ProductStatus } from '../types';

export type Filters = {
  q: string;
  ownerId: string;
  status: '' | ProductStatus;
  sortBy: 'createdAt' | 'name' | 'price' | 'inventory';
  sortOrder: 'asc' | 'desc';
};

export function ProductFilters(props: {
  owners: ProductOwner[];
  value: Filters;
  onChange: (next: Filters) => void;
}) {
  const { owners, value, onChange } = props;
  const [searchInput, setSearchInput] = useState(value.q);
  const [debouncedSearchInput] = useDebounce(searchInput, 500);

  useEffect(() => {
    onChange({ ...value, q: debouncedSearchInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput]);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="row" style={{ alignItems: 'flex-end', flexWrap: 'wrap', rowGap: 12 }}>
        <div style={{ flex: 2, minWidth: 220, marginBottom: 0 }}>
          <label className="label">Search (Name / SKU)</label>
          <input
            className="input"
            placeholder="e.g., Protein, SKU-123"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
          <label className="label">Owner</label>
          <select
            className="input"
            value={value.ownerId}
            onChange={(e) => onChange({ ...value, ownerId: e.target.value })}
          >
            <option value="">All owners</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
          <label className="label">Status</label>
          <select
            className="input"
            value={value.status}
            onChange={(e) => onChange({ ...value, status: e.target.value as any })}
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DISCONTINUED">DISCONTINUED</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label className="label">Sort</label>
          <div className="row" style={{ gap: 8 }}>
            <select
              className="input"
              value={value.sortBy}
              onChange={(e) => onChange({ ...value, sortBy: e.target.value as any })}
            >
              <option value="createdAt">Created</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="inventory">Inventory</option>
            </select>
            <select
              className="input"
              value={value.sortOrder}
              onChange={(e) => onChange({ ...value, sortOrder: e.target.value as any })}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

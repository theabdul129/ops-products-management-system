import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatMoney } from '../utils/format';

export function ProductTable({
  products,
  onDelete
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: 64 }}>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Owner</th>
            <th style={{ width: 100 }}>Price</th>
            <th style={{ width: 80 }}>Inventory</th>
            <th style={{ width: 80 }}>Status</th>
            <th style={{ width: 100 }}></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="thumb" />
                ) : (
                  <div className="thumb placeholder">—</div>
                )}
              </td>
              <td>
                <Link to={`/products/${p.id}`} style={{ fontWeight: 600 }}>
                  {p.name}
                </Link>
              </td>
              <td>{p.sku}</td>
              <td>{p.owner?.name}</td>
              <td>{formatMoney(p.price)}</td>
              <td>{p.inventory}</td>
              <td>
                <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="actions">
                  <Link to={`/products/${p.id}`} className="btn secondary">
                    View
                  </Link>
                  <Link to={`/products/${p.id}/edit`} className="btn secondary">
                    Edit
                  </Link>
                  <button className="btn danger" onClick={() => onDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: 20, textAlign: 'center', opacity: 0.7 }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

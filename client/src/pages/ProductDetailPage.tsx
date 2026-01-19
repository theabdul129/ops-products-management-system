import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteProduct, getProduct } from '../api/products';
import { formatMoney } from '../utils/format';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id)
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    }
  });

  if (productQuery.isLoading) {
    return <div className="card">Loading...</div>;
  }

  if (productQuery.isError) {
    return <div className="card">Error: {(productQuery.error as Error).message}</div>;
  }

  const p = productQuery.data;
  if (!p) return <div className="card">Not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>{p.name}</h1>
          <div className="muted">SKU: {p.sku}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/products" className="btn secondary">
            Back
          </Link>
          <Link to={`/products/${p.id}/edit`} className="btn secondary">
            Edit
          </Link>
          <button
            className="btn danger"
            onClick={() => {
              if (confirm('Delete this product?')) {
                deleteMutation.mutate();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 200 }}>
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{ width: 200, height: 200, borderRadius: 12, objectFit: 'cover', border: '1px solid #e8e8f0' }}
              />
            ) : (
              <div
                style={{ width: 200, height: 200, borderRadius: 12, background: '#fafafe', border: '1px solid #e8e8f0', display: 'grid', placeItems: 'center' }}
                className="muted"
              >
                No image
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div className="label">Owner</div>
                <div style={{ fontWeight: 600 }}>{p.owner?.name}</div>
                {p.owner?.email && <div className="muted">{p.owner.email}</div>}
              </div>

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">Price</div>
                  <div style={{ fontWeight: 600 }}>{formatMoney(p.price)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">Inventory</div>
                  <div style={{ fontWeight: 600 }}>{p.inventory}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">Status</div>
                  <div>
                    <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div style={{ flex: 1 }}>
                  <div className="label">Created</div>
                  <div>{new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="label">Updated</div>
                  <div>{new Date(p.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              {deleteMutation.isError && <div style={{ color: 'crimson' }}>Error: {(deleteMutation.error as Error).message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

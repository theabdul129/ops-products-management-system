import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createProduct, getOwners, getProduct, updateProduct } from '../api/products';
import type { ProductStatus } from '../types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().nonnegative('Price must be >= 0'),
  inventory: z.number().int().nonnegative('Inventory must be >= 0'),
  status: z.enum(['ACTIVE','INACTIVE','DISCONTINUED']),
  imageUrl: z.string().url('Image URL must be valid').optional().nullable().or(z.literal('')),
  ownerId: z.string().uuid('Owner is required')
});

type FormValues = z.infer<typeof schema>;

export function ProductFormPage() {
  const params = useParams();
  const isEdit = Boolean(params.id);
  const id = params.id as string | undefined;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const ownersQuery = useQuery({ queryKey: ['owners'], queryFn: getOwners });
  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: isEdit && !!id
  });

  const owners = ownersQuery.data ?? [];

  const defaultValues: FormValues = useMemo(
    () => ({
      name: '',
      sku: '',
      price: 0,
      inventory: 0,
      status: 'ACTIVE',
      imageUrl: '',
      ownerId: owners[0]?.id ?? ''
    }),
    [owners]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (!isEdit) return;
    if (!productQuery.data) return;

    const p = productQuery.data;
    form.reset({
      name: p.name,
      sku: p.sku,
      price: Number(p.price),
      inventory: p.inventory,
      status: p.status as ProductStatus,
      imageUrl: p.imageUrl ?? '',
      ownerId: p.ownerId
    });
    setPreview(p.imageUrl ?? '');
  }, [form, isEdit, productQuery.data]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (v: FormValues) => updateProduct(id!, { ...v, imageUrl: v.imageUrl || null }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product', id] });
      navigate(`/products/${id}`);
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      imageUrl: values.imageUrl ? values.imageUrl : null
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>{isEdit ? 'Edit Product' : 'New Product'}</h1>
          <div className="muted">{isEdit ? 'Update product details.' : 'Create a new product.'}</div>
        </div>
        <Link to={isEdit ? `/products/${id}` : '/products'} className="btn secondary">
          Back
        </Link>
      </div>

      <div className="card">
        {(ownersQuery.isLoading || (isEdit && productQuery.isLoading)) && <div>Loading...</div>}
        {(ownersQuery.isError || productQuery.isError) && (
          <div style={{ color: 'crimson' }}>Error: {((ownersQuery.error || productQuery.error) as Error).message}</div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="label">Name</label>
            <input className="input" {...form.register('name')} />
            {form.formState.errors.name && <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.name.message}</div>}
          </div>

          <div className="row" style={{ gap: 12, flexWrap: 'wrap', rowGap: 16 }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <label className="label">SKU</label>
              <input className="input" {...form.register('sku')} />
              {form.formState.errors.sku && <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.sku.message}</div>}
            </div>

            <div style={{ flex: 1, minWidth: 250 }}>
              <label className="label">Owner</label>
              <select className="input" {...form.register('ownerId')}>
                <option value="" disabled>
                  Select owner
                </option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.ownerId && <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.ownerId.message}</div>}
            </div>
          </div>

          <div className="row" style={{ gap: 12, flexWrap: 'wrap', rowGap: 16 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="label">Price</label>
              <input
                className="input"
                type="number"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
              />
              {form.formState.errors.price && <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.price.message}</div>}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="label">Inventory</label>
              <input className="input" type="number" {...form.register('inventory', { valueAsNumber: true })} />
              {form.formState.errors.inventory && (
                <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.inventory.message}</div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="label">Status</label>
              <select className="input" {...form.register('status')}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="DISCONTINUED">DISCONTINUED</option>
              </select>
              {form.formState.errors.status && (
                <div style={{ color: 'crimson', fontSize: 12, marginTop: 4 }}>{form.formState.errors.status.message}</div>
              )}
            </div>
          </div>

          <div>
            <label className="label">Image URL (optional)</label>
            <input
              className="input"
              placeholder="https://..."
              {...form.register('imageUrl')}
              onChange={(e) => {
                form.setValue('imageUrl', e.target.value);
                setPreview(e.target.value);
              }}
            />
            {form.formState.errors.imageUrl && (
              <div style={{ color: 'crimson', fontSize: 12 }}>{form.formState.errors.imageUrl.message}</div>
            )}
            {preview && (
              <div style={{ marginTop: 10 }}>
                <div className="label">Preview</div>
                <img src={preview} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid #e8e8f0' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button className="btn primary" disabled={saving} type="submit">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>

          {(createMutation.isError || updateMutation.isError) && (
            <div style={{ color: 'crimson' }}>Error: {((createMutation.error || updateMutation.error) as Error).message}</div>
          )}
        </form>
      </div>
    </div>
  );
}

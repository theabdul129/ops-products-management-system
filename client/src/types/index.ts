export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export type ProductOwner = {
  id: string;
  name: string;
  email?: string | null;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: string; // Prisma Decimal serialized as string
  inventory: number;
  status: ProductStatus;
  imageUrl?: string | null;
  ownerId: string;
  owner: ProductOwner;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  items: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

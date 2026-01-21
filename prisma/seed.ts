import { PrismaClient } from '@prisma/client'
import { slugify, uniqueProductSlug } from '../lib/slug'

const prisma = new PrismaClient()

const img = {
  serum: '',
}

type OwnerKey = 'skin' | 'fit' | 'med' | 'well' | 'nutri' | 'care'

const PRODUCTS: Array<{
  sku: string
  name: string
  description: string
  price: number
  inventory: number
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'
  ownerKey: OwnerKey
  imageUrl?: string
  createdAt?: Date
}> = [
  { sku: 'SKIN-001', name: 'Vitamin C Serum', description: 'Brightening serum with vitamin C for radiant skin', price: 34.99, inventory: 120, status: 'ACTIVE', ownerKey: 'skin', imageUrl: img.serum },
]

function assignCreatedAt() {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  PRODUCTS.forEach((p, i) => {
    const daysAgo = 180 - Math.floor((i * 180) / PRODUCTS.length) + (i % 11) - 5
    const d = new Date(now - Math.max(0, daysAgo) * oneDay)
    d.setHours((i * 13) % 24, (i * 17) % 60, (i * 23) % 60, 0)
    p.createdAt = d
  })
}
assignCreatedAt()

async function main() {
  await prisma.product.deleteMany()
  await prisma.productOwner.deleteMany()

  const [skin, fit, med, well, nutri, care] = await Promise.all([
    prisma.productOwner.create({ data: { name: 'Sarah Skin', slug: slugify('Sarah Skin'), email: 'sarah@skincare.com' } }),
    prisma.productOwner.create({ data: { name: 'Mike Muscle', slug: slugify('Mike Muscle'), email: 'mike@fitness.com' } }),
    prisma.productOwner.create({ data: { name: 'Dr. Health', slug: slugify('Dr. Health'), email: 'dr@medical.com' } }),
    prisma.productOwner.create({ data: { name: 'Wendy Wellness', slug: slugify('Wendy Wellness'), email: 'wendy@wellness.com' } }),
    prisma.productOwner.create({ data: { name: 'Nick Nutrition', slug: slugify('Nick Nutrition'), email: 'nick@nutrition.com' } }),
    prisma.productOwner.create({ data: { name: 'Carey Care', slug: slugify('Carey Care'), email: 'carey@care.com' } }),
  ])

  const PRODUCTS: Array<{
    sku: string
    name: string
    description: string
    price: number
    inventory: number
    status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'
    ownerKey: OwnerKey
    imageUrl?: string
    createdAt?: Date
  }> = [
    { sku: 'SKIN-001', name: 'Vitamin C Serum', description: 'Brightening serum with vitamin C', price: 34.99, inventory: 120, status: 'ACTIVE', ownerKey: 'skin' },
    { sku: 'SKIN-002', name: 'Hyaluronic Acid', description: 'Deeply hydrating facial serum', price: 29.99, inventory: 15, status: 'ACTIVE', ownerKey: 'skin' },
    { sku: 'FIT-001', name: 'Whey Protein', description: 'Premium chocolate protein powder', price: 49.99, inventory: 50, status: 'ACTIVE', ownerKey: 'fit' },
    { sku: 'FIT-002', name: 'Creatine Monohydrate', description: 'Pure strength supplement', price: 24.99, inventory: 8, status: 'ACTIVE', ownerKey: 'fit' },
    { sku: 'MED-001', name: 'Multivitamin Gold', description: 'Daily essential vitamins', price: 19.99, inventory: 200, status: 'ACTIVE', ownerKey: 'med' },
    { sku: 'MED-002', name: 'Omega-3 Fish Oil', description: 'Heart healthy fatty acids', price: 22.99, inventory: 0, status: 'DISCONTINUED', ownerKey: 'med' },
    { sku: 'WELL-001', name: 'Yoga Mat Pro', description: 'Non-slip eco-friendly mat', price: 55.00, inventory: 30, status: 'ACTIVE', ownerKey: 'well' },
    { sku: 'WELL-002', name: 'Meditation Cushion', description: 'Comfortable zafu cushion', price: 40.00, inventory: 12, status: 'INACTIVE', ownerKey: 'well' },
    { sku: 'NUTRI-001', name: 'Organic Chia Seeds', description: 'Superfood seeds 500g', price: 12.50, inventory: 80, status: 'ACTIVE', ownerKey: 'nutri' },
    { sku: 'NUTRI-002', name: 'Quinoa Bulk', description: 'White organic quinoa 1kg', price: 15.00, inventory: 45, status: 'ACTIVE', ownerKey: 'nutri' },
    { sku: 'CARE-001', name: 'First Aid Kit', description: 'Emergency travel kit', price: 25.00, inventory: 5, status: 'ACTIVE', ownerKey: 'care' },
    { sku: 'CARE-002', name: 'Hand Sanitizer', description: '70% alcohol bulk pack', price: 18.00, inventory: 500, status: 'ACTIVE', ownerKey: 'care' },
  ]

  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  PRODUCTS.forEach((p, i) => {
    const daysAgo = 180 - Math.floor((i * 180) / PRODUCTS.length) + (i % 11) - 5
    const d = new Date(now - Math.max(0, daysAgo) * oneDay)
    d.setHours((i * 13) % 24, (i * 17) % 60, (i * 23) % 60, 0)
    p.createdAt = d
  })

  const ownerMap: Record<OwnerKey, { id: number }> = { skin, fit, med, well, nutri, care }

  for (const p of PRODUCTS) {
    const slug = await uniqueProductSlug(prisma, slugify(p.name))
    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        inventory: p.inventory,
        status: p.status,
        ownerId: ownerMap[p.ownerKey].id,
        ...(p.imageUrl && { imageUrl: p.imageUrl }),
        ...(p.createdAt && { createdAt: p.createdAt }),
      },
    })
  }

  console.log(`Database seeding completed successfully! Seeded ${PRODUCTS.length} products and 6 owners.`)

}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const productsPath = path.join(__dirname, 'baby-products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`Loading ${productsData.length} baby products to import...`);

    // Default user to assign products to (first user found, or create one)
    let user = await prisma.user.findFirst();

    if (!user) {
        console.log('No user found. Creating a default admin user...');
        user = await prisma.user.create({
            data: {
                email: 'admin@cilca.com',
                username: 'cilca-admin',
                passwordHash: '$2b$10$placeholder_hash_for_seeding',
                firstName: 'cilca',
                lastName: 'Admin',
                role: 'ADMIN',
            },
        });
        console.log(`Created default user ID: ${user.id}`);
    }

    console.log(`Using user ID: ${user.id} (${user.email}) as the product owner.`);

    let successCount = 0;
    let failCount = 0;

    for (const item of productsData) {
        // 1. Ensure Category Exists
        let category = await prisma.category.findUnique({
            where: { name: item.category_name },
        });

        if (!category) {
            console.log(`Creating category: ${item.category_name}`);
            category = await prisma.category.create({
                data: {
                    name: item.category_name,
                    description: `Products in ${item.category_name}`,
                },
            });
        }

        // 2. Prepare Product Data
        const imageUrls = item.images.map((img: any) => img.url);
        const tags = item.title.split(' ')
            .map((w: string) => w.replace(/[^\w\s]/gi, '').toLowerCase())
            .filter((w: string) => w.length > 2)
            .slice(0, 5);

        if (tags.length < 2) {
            tags.push('baby');
            if (tags.length < 2) tags.push('care');
        }

        // 3. Create Product
        console.log(`Importing: ${item.title}`);
        try {
            const product = await prisma.product.create({
                data: {
                    title: item.title,
                    description: item.details,
                    originalPrice: parseFloat(item.price_obj.value),
                    discountedPrice: parseFloat(item.price_obj.value) * 0.9, // 10% introductory discount
                    stock: item.stock || 10,
                    condition: 'new',
                    category: item.category_name,
                    categoryId: category.id,
                    tags: tags,
                    imageUrl: imageUrls,
                    userId: user.id,
                    isActive: true,
                    images: {
                        create: imageUrls.map((url: string) => ({
                            url: url,
                        })),
                    },
                },
            });
            console.log(`  -> Created product ID: ${product.id}`);
            successCount++;
        } catch (error) {
            console.error(`  -> Failed to create product ${item.title}:`, error);
            failCount++;
        }
    }

    console.log(`\nImport completed! Success: ${successCount}, Failed: ${failCount}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

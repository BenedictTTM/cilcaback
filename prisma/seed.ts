import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Dummy Admin
    console.log('Creating dummy admin user...');
    const dummyAdmin = await prisma.user.upsert({
        where: { email: 'dummy_admin@optimum.com' },
        update: {},
        create: {
            email: 'dummy_admin@optimum.com',
            username: 'dummy_admin',
            passwordHash: '$2b$10$placeholder_hash_for_seeding',
            role: 'ADMIN',
            firstName: 'Dummy',
            lastName: 'Admin'
        }
    });

    const scriptsDir = path.join(__dirname, '../scripts');
    
    // Seed Categories
    console.log('Seeding Categories...');
    const categoriesPath = path.join(scriptsDir, 'Category.json');
    if (fs.existsSync(categoriesPath)) {
        const rawData = fs.readFileSync(categoriesPath, 'utf8');
        const categories = JSON.parse(rawData);
        for (const cat of categories) {
            await prisma.category.upsert({
                where: { name: cat.name },
                update: { description: cat.description },
                create: { name: cat.name, description: cat.description }
            });
        }
        console.log(`✅ Seeded ${categories.length} Categories.`);
    }

    // Seed Products
    console.log('Seeding Products...');
    const productsPath = path.join(scriptsDir, 'Product.json');
    if (fs.existsSync(productsPath)) {
        const rawData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(rawData);
        let count = 0;
        for (const prod of products) {
            let categoryId: number | null = null;
            if (prod.category) {
                const catInfo = await prisma.category.findUnique({ where: { name: prod.category }});
                if (catInfo) categoryId = catInfo.id;
            }

            const existing = await prisma.product.findFirst({ where: { title: prod.title } });
            if (!existing) {
                await prisma.product.create({
                    data: {
                        title: prod.title,
                        description: prod.description,
                        imageUrl: prod.imageUrl || [],
                        category: prod.category || 'Uncategorized',
                        categoryId: categoryId,
                        originalPrice: prod.originalPrice || 0,
                        discountedPrice: prod.discountedPrice || 0,
                        stock: prod.stock || 0,
                        isActive: prod.isActive ?? true,
                        isSold: prod.isSold ?? false,
                        condition: prod.condition || 'New',
                        tags: prod.tags || [],
                        views: prod.views || 0,
                        userId: dummyAdmin.id
                    }
                });
                count++;
            }
        }
        console.log(`✅ Seeded ${count} Products.`);
    }

    // Seed BlogPosts
    console.log('Seeding Blog Posts...');
    const blogPostsPath = path.join(scriptsDir, 'BlogPost.json');
    if (fs.existsSync(blogPostsPath)) {
        const rawData = fs.readFileSync(blogPostsPath, 'utf8');
        const posts = JSON.parse(rawData);
        let count = 0;
        for (const post of posts) {
             const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
             if (!existing) {
                 await prisma.blogPost.create({
                     data: {
                         title: post.title,
                         slug: post.slug,
                         content: post.content,
                         excerpt: post.excerpt,
                         coverImage: post.coverImage,
                         category: post.category || 'Uncategorized',
                         tags: post.tags || [],
                         status: post.status || 'PUBLISHED',
                         featured: post.featured || false,
                         views: post.views || 0,
                         authorId: dummyAdmin.id,
                         publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
                     }
                 });
                 count++;
             }
        }
        console.log(`✅ Seeded ${count} Blog Posts.`);
    }

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = {
    // I will include the array from the user's prompt directly here.
    "items": [
        {
            "id": 133761497,
            "name": "Top view postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/top-view-postpartum-box-still-life_23-2151174319.jpg" }
        },
        {
            "id": 133761523,
            "name": "Postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-box-still-life_23-2151174361.jpg" }
        },
        {
            "id": 6675030,
            "name": "Front view of cute little baby girl accesories",
            "preview": { "url": "https://img.freepik.com/free-photo/front-view-cute-little-baby-girl-accesories_23-2148415501.jpg" }
        },
        {
            "id": 133761542,
            "name": "Postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-box-still-life_23-2151174337.jpg" }
        },
        {
            "id": 6952474,
            "name": "Flat lay of baby bottle and comb for baby shower",
            "preview": { "url": "https://img.freepik.com/free-photo/flat-lay-baby-bottle-comb-baby-shower_23-2148430459.jpg" }
        },
        {
            "id": 12977610,
            "name": "Plastic cup and packages beside",
            "preview": { "url": "https://img.freepik.com/free-photo/plastic-cup-packages-beside_23-2148889877.jpg" }
        },
        {
            "id": 94964165,
            "name": "Objects showing its a girl expectancy",
            "preview": { "url": "https://img.freepik.com/free-photo/objects-showing-its-girl-expectancy_23-2150166750.jpg" }
        },
        {
            "id": 133761536,
            "name": "Postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-box-still-life_23-2151174339.jpg" }
        },
        {
            "id": 3148395,
            "name": "Soap; sponge; cream and pink salt on blue background",
            "preview": { "url": "https://img.freepik.com/free-photo/soap-sponge-cream-pink-salt-blue-background_23-2147818102.jpg" }
        },
        {
            "id": 133761540,
            "name": "Postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-box-still-life_23-2151174382.jpg" }
        },
        {
            "id": 94964228,
            "name": "Objects showing its a girl expectancy",
            "preview": { "url": "https://img.freepik.com/free-photo/objects-showing-its-girl-expectancy_23-2150166866.jpg" }
        },
        {
            "id": 133761537,
            "name": "Postpartum  box still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-box-still-life_23-2151174384.jpg" }
        },
        {
            "id": 133761514,
            "name": "Postpartum  basket still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-basket-still-life_23-2151174324.jpg" }
        },
        {
            "id": 31897677,
            "name": "Fluffy toy texture close up",
            "preview": { "url": "https://img.freepik.com/free-photo/fluffy-toy-texture-close-up_23-2149686925.jpg" }
        },
        {
            "id": 82450827,
            "name": "View of socks for girl gender reveal",
            "preview": { "url": "https://img.freepik.com/free-psd/view-socks-girl-gender-reveal_23-2150983239.jpg" }
        },
        {
            "id": 54059365,
            "name": "Still life of positive pregnancy test",
            "preview": { "url": "https://img.freepik.com/free-photo/still-life-positive-pregnancy-test_23-2150621860.jpg" }
        },
        {
            "id": 133761520,
            "name": "Postpartum  basket still life",
            "preview": { "url": "https://img.freepik.com/free-photo/postpartum-basket-still-life_23-2151174328.jpg" }
        },
        {
            "id": 94964225,
            "name": "Objects showing its a girl expectancy",
            "preview": { "url": "https://img.freepik.com/free-photo/objects-showing-its-girl-expectancy_23-2150166860.jpg" }
        }
    ]
};

async function main() {
    // Assign everything to "Baby Care" category found in previous query
    const targetCategory = await prisma.category.findFirst({ where: { name: 'Baby Care' } });
    if (!targetCategory) {
        console.error('Baby Care category not found. Make sure it exists.');
        return;
    }

    // Attempt to get a user for products (first available, preferred ADMIN)
    const user = await prisma.user.findFirst();
    const userId = user ? user.id : 1;

    let importedCount = 0;
    for (const item of data.items) {
        if (!item.name || !item.preview || !item.preview.url) continue;

        try {
            await prisma.product.create({
                data: {
                    title: item.name,
                    description: 'A beautiful baby product from our curated collection.',
                    imageUrl: [item.preview.url],
                    category: targetCategory.name,
                    categoryId: targetCategory.id,
                    originalPrice: 40.0,
                    discountedPrice: 35.0,
                    stock: 50,
                    condition: 'New',
                    userId: userId,
                    tags: ['baby products', 'new-arrival']
                }
            });
            console.log(`Imported: ${item.name}`);
            importedCount++;
        } catch (error) {
            console.error(`Failed to import ${item.name}:`, error.message);
        }
    }

    console.log(`Successfully completed importing ${importedCount} products into "Baby Care" category!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { dbService } from './database';
import { Database } from 'sqlite3';

const db = dbService.getDatabase();

// Sample products
const products = [
    { model_number: 'WDT780SAEM1', name: 'Whirlpool Dishwasher', type: 'Dishwasher', brand: 'Whirlpool', description: 'Top control dishwasher with stainless steel interior' },
    { model_number: 'WRF535SWHZ', name: 'Whirlpool Refrigerator', type: 'Refrigerator', brand: 'Whirlpool', description: 'French door refrigerator with ice maker' },
    { model_number: 'GDT695SSJSS', name: 'GE Dishwasher', type: 'Dishwasher', brand: 'GE', description: 'Built-in dishwasher with bottle wash jets' },
    { model_number: 'GFE28GYNFS', name: 'GE Refrigerator', type: 'Refrigerator', brand: 'GE', description: 'French door refrigerator with Keurig K-Cup' },
    { model_number: 'LFXS26973S', name: 'LG Refrigerator', type: 'Refrigerator', brand: 'LG', description: 'Smart French door refrigerator with InstaView' }
];

// Sample parts
const parts = [
    { part_number: 'PS11752778', name: 'Ice Maker Assembly', description: 'Complete ice maker assembly for refrigerators', category: 'Ice Maker', price: 129.99, in_stock: 1, image_url: '/assets/parts/ice-maker.jpg' },
    { part_number: 'PS11755825', name: 'Water Inlet Valve', description: 'Water inlet valve for ice maker and water dispenser', category: 'Water System', price: 45.99, in_stock: 1, image_url: '/assets/parts/water-valve.jpg' },
    { part_number: 'PS11754026', name: 'Dishwasher Spray Arm', description: 'Lower spray arm assembly', category: 'Spray Arm', price: 32.50, in_stock: 1, image_url: '/assets/parts/spray-arm.jpg' },
    { part_number: 'PS11768671', name: 'Dishwasher Pump', description: 'Drain pump assembly', category: 'Pump', price: 89.99, in_stock: 1, image_url: '/assets/parts/pump.jpg' },
    { part_number: 'PS11742119', name: 'Door Gasket', description: 'Refrigerator door gasket seal', category: 'Seal', price: 67.50, in_stock: 1, image_url: '/assets/parts/gasket.jpg' },
    { part_number: 'PS11749009', name: 'Temperature Control Thermostat', description: 'Temperature control for refrigerator', category: 'Thermostat', price: 54.99, in_stock: 1, image_url: '/assets/parts/thermostat.jpg' },
    { part_number: 'PS11755626', name: 'Dishwasher Detergent Dispenser', description: 'Detergent dispenser assembly', category: 'Dispenser', price: 78.00, in_stock: 1, image_url: '/assets/parts/dispenser.jpg' },
    { part_number: 'PS11738175', name: 'Evaporator Fan Motor', description: 'Fan motor for refrigerator evaporator', category: 'Motor', price: 95.00, in_stock: 1, image_url: '/assets/parts/fan-motor.jpg' }
];

// Installation guides
const installationGuides = [
    {
        part_number: 'PS11752778',
        instructions: `Ice Maker Installation Steps:
1. Unplug refrigerator and turn off water supply
2. Remove ice bin from freezer compartment
3. Locate ice maker mounting bracket on left wall of freezer
4. Disconnect electrical harness from old ice maker
5. Remove mounting screws and lift out old ice maker
6. Position new ice maker on mounting bracket
7. Secure with mounting screws (do not overtighten)
8. Connect electrical harness until it clicks
9. Turn on water supply and check for leaks
10. Plug in refrigerator and wait 24 hours for first ice batch

Important: Ensure water line is properly connected and has adequate pressure (20-120 psi).`,
        difficulty: 'Moderate',
        estimated_time: '30-45 minutes',
        tools_required: 'Phillips screwdriver, adjustable wrench, towels',
        video_url: 'https://youtube.com/install-ice-maker'
    },
    {
        part_number: 'PS11755825',
        instructions: `Water Inlet Valve Installation Steps:
1. Unplug refrigerator and turn off water supply
2. Pull refrigerator away from wall for access to back panel
3. Disconnect water line from inlet valve
4. Disconnect electrical connections
5. Remove mounting screws and remove old valve
6. Install new valve in mounting position
7. Secure with mounting screws
8. Reconnect electrical connections
9. Reconnect water line (ensure proper connection)
10. Turn on water supply and check for leaks
11. Plug in refrigerator`,
        difficulty: 'Easy to Moderate',
        estimated_time: '20-30 minutes',
        tools_required: 'Phillips screwdriver, adjustable wrench, bucket',
        video_url: 'https://youtube.com/install-water-valve'
    },
    {
        part_number: 'PS11754026',
        instructions: `Dishwasher Spray Arm Installation Steps:
1. Turn off power to dishwasher
2. Remove lower dish rack
3. Unscrew spray arm retaining nut (turn counterclockwise)
4. Lift out old spray arm
5. Inspect spray arm support for debris and clean if needed
6. Position new spray arm over support
7. Install retaining nut and tighten (hand-tight only)
8. Rotate spray arm to ensure free movement
9. Replace lower dish rack
10. Restore power and run test cycle`,
        difficulty: 'Easy',
        estimated_time: '10-15 minutes',
        tools_required: 'None (hand tools only)',
        video_url: 'https://youtube.com/install-spray-arm'
    }
];

// Troubleshooting guides
const troubleshootingGuides = [
    {
        product_type: 'Refrigerator',
        issue: 'Ice maker not working',
        solution: `Common causes and solutions:
1. Water Supply Issues:
   - Check water supply valve is fully open
   - Verify water line is not frozen (check temperature)
   - Ensure water pressure is 20-120 psi
   
2. Ice Maker Switch:
   - Verify ice maker is turned ON (arm is down)
   - Check control panel settings
   
3. Temperature Issues:
   - Freezer should be 0-5°F (-18 to -15°C)
   - If too warm, ice won't form properly
   
4. Water Filter:
   - Replace if older than 6 months
   - Clogged filter reduces water flow
   
5. Mechanical Issues:
   - Ice maker assembly may need replacement (Part PS11752778)
   - Water inlet valve may be faulty (Part PS11755825)
   
If issue persists after checking these items, replacement of ice maker assembly is recommended.`,
        related_parts: 'PS11752778, PS11755825'
    },
    {
        product_type: 'Dishwasher',
        issue: 'Poor cleaning performance',
        solution: `Troubleshooting steps:
1. Spray Arm Issues:
   - Check spray arms spin freely
   - Clean spray arm holes (use toothpick if clogged)
   - Replace if damaged (Part PS11754026)
   
2. Water Supply:
   - Ensure hot water reaches dishwasher (120°F/49°C)
   - Check water inlet valve for blockage
   
3. Detergent Dispenser:
   - Verify dispenser opens during cycle
   - Use fresh detergent (powder can cake if old)
   - Consider replacing dispenser (Part PS11755626)
   
4. Filter Maintenance:
   - Clean dishwasher filter monthly
   - Remove debris from bottom of tub
   
5. Loading:
   - Don't overload - water must reach all surfaces
   - Ensure dishes don't block spray arms
   
6. Pump Issues:
   - If water doesn't drain, pump may be faulty (Part PS11768671)`,
        related_parts: 'PS11754026, PS11755626, PS11768671'
    },
    {
        product_type: 'Refrigerator',
        issue: 'Not cooling properly',
        solution: `Diagnostic steps:
1. Basic Checks:
   - Ensure refrigerator is plugged in
   - Check temperature settings (37°F/3°C for fridge, 0°F/-18°C for freezer)
   - Verify door seals are intact (replace if damaged - Part PS11742119)
   
2. Airflow:
   - Don't overfill - blocks air circulation
   - Ensure vents inside are not blocked
   - Clean condenser coils (back or bottom)
   
3. Evaporator Fan:
   - Listen for fan running in freezer
   - If silent, fan motor may need replacement (Part PS11738175)
   
4. Temperature Control:
   - Test thermostat functionality
   - Replace if defective (Part PS11749009)
   
5. Door Issues:
   - Check that doors close completely
   - Replace gasket if air leaks detected
   
If refrigerator is completely dead, check circuit breaker and outlet first.`,
        related_parts: 'PS11742119, PS11738175, PS11749009'
    },
    {
        product_type: 'Dishwasher',
        issue: 'Not draining',
        solution: `Drain troubleshooting:
1. Check Drain Hose:
   - Ensure hose is not kinked
   - Verify proper installation height
   - Check for blockages
   
2. Filter and Sump:
   - Remove and clean filter
   - Check sump area for debris
   - Remove any obstructions
   
3. Drain Pump:
   - Listen for pump operation during drain cycle
   - If silent or humming, pump may be faulty (Part PS11768671)
   - Check pump impeller for obstructions
   
4. Garbage Disposal:
   - If newly installed, knockout plug must be removed
   - Check disposal for clogs
   
5. Air Gap:
   - If installed, clean air gap of debris
   
Replace drain pump if mechanical failure is confirmed.`,
        related_parts: 'PS11768671'
    }
];

async function seedDatabase() {
    console.log('Starting database seeding...');

    // Insert products
    for (const product of products) {
        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO products (model_number, name, type, brand, description) VALUES (?, ?, ?, ?, ?)`,
                [product.model_number, product.name, product.type, product.brand, product.description],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
    console.log('Products seeded.');

    // Insert parts
    for (const part of parts) {
        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO parts (part_number, name, description, category, price, in_stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [part.part_number, part.name, part.description, part.category, part.price, part.in_stock, part.image_url],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
    console.log('Parts seeded.');

    // Create compatibility relationships
    // Ice maker compatible with all refrigerators
    const icemakers = ['PS11752778', 'PS11755825'];
    const refrigerators = ['WRF535SWHZ', 'GFE28GYNFS', 'LFXS26973S'];

    for (const partNum of icemakers) {
        for (const modelNum of refrigerators) {
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO compatibility (part_id, product_id) 
           SELECT p.id, pr.id FROM parts p, products pr 
           WHERE p.part_number = ? AND pr.model_number = ?`,
                    [partNum, modelNum],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
    }

    // Dishwasher parts compatible with dishwashers
    const dishwasherParts = ['PS11754026', 'PS11768671', 'PS11755626'];
    const dishwashers = ['WDT780SAEM1', 'GDT695SSJSS'];

    for (const partNum of dishwasherParts) {
        for (const modelNum of dishwashers) {
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO compatibility (part_id, product_id) 
           SELECT p.id, pr.id FROM parts p, products pr 
           WHERE p.part_number = ? AND pr.model_number = ?`,
                    [partNum, modelNum],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
    }

    // Other refrigerator parts
    const fridgeParts = ['PS11742119', 'PS11749009', 'PS11738175'];
    for (const partNum of fridgeParts) {
        for (const modelNum of refrigerators) {
            await new Promise<void>((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO compatibility (part_id, product_id) 
           SELECT p.id, pr.id FROM parts p, products pr 
           WHERE p.part_number = ? AND pr.model_number = ?`,
                    [partNum, modelNum],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
    }
    console.log('Compatibility data seeded.');

    // Insert installation guides
    for (const guide of installationGuides) {
        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO installation_guides (part_id, instructions, difficulty, estimated_time, tools_required, video_url)
         SELECT id, ?, ?, ?, ?, ? FROM parts WHERE part_number = ?`,
                [guide.instructions, guide.difficulty, guide.estimated_time, guide.tools_required, guide.video_url, guide.part_number],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
    console.log('Installation guides seeded.');

    // Insert troubleshooting guides
    for (const guide of troubleshootingGuides) {
        await new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO troubleshooting_guides (product_type, issue, solution, related_parts) VALUES (?, ?, ?, ?)`,
                [guide.product_type, guide.issue, guide.solution, guide.related_parts],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
    console.log('Troubleshooting guides seeded.');

    console.log('Database seeding completed successfully!');
    dbService.close();
}

seedDatabase().catch(console.error);

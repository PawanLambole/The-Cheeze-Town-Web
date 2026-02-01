
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gnpdhisyxwqvnjleyola.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGRoaXN5eHdxdm5qbGV5b2xhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNDY4MSwiZXhwIjoyMDgyMDgwNjgxfQ.TpN6iRbVHyagqvEBJioMz2cfSxbBj0fFuQYUhCKYAac';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTrailItem() {
    console.log('Connecting to Supabase...');

    // 1. Get a category for the item
    const { data: categories, error: catError } = await supabase
        .from('menu_categories')
        .select('id, name')
        .limit(1);

    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    let categoryId;
    let categoryName;

    if (categories && categories.length > 0) {
        categoryId = categories[0].id;
        categoryName = categories[0].name;
        console.log(`Using existing category: ${categoryName} (ID: ${categoryId})`);
    } else {
        // Create a category if none exist
        console.log('No categories found. Creating "Specials" category...');
        const { data: newCategory, error: createError } = await supabase
            .from('menu_categories')
            .insert({ name: 'Specials', description: 'Special items', is_active: true, display_order: 100 })
            .select()
            .single();

        if (createError) {
            console.error('Error creating category:', createError);
            return;
        }
        categoryId = newCategory.id;
        categoryName = newCategory.name;
        console.log(`Created new category: ${categoryName} (ID: ${categoryId})`);
    }

    // 2. Check if "Trail" item already exists
    const { data: existingItems, error: searchError } = await supabase
        .from('menu_items')
        .select('id')
        .eq('name', 'Trail');

    if (searchError) {
        console.error('Error searching for existing item:', searchError);
        return;
    }

    if (existingItems && existingItems.length > 0) {
        console.log('Item "Trail" already exists. Skipping insertion.');
        return;
    }

    // 3. Insert "Trail" item
    const { data: newItem, error: insertError } = await supabase
        .from('menu_items')
        .insert({
            name: 'Trail',
            description: 'A special trail item.',
            price: 100, // Arbitrary price, payment will be bypassed
            category_id: categoryId,
            category: categoryName,
            is_available: true,
            is_vegetarian: true,
            image_url: 'https://placehold.co/600x400?text=Trail', // Placeholder image
            preparation_time: 5
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error inserting item:', insertError);
    } else {
        console.log('Successfully added "Trail" menu item:', newItem);
    }
}

addTrailItem();

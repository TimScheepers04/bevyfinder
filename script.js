// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const beverageNameInput = document.getElementById('beverage-name');
const searchBtn = document.getElementById('search-btn');
const suggestions = document.getElementById('suggestions');
const uploadArea = document.getElementById('upload-area');
const photoInput = document.getElementById('photo-input');
const previewArea = document.getElementById('preview-area');
const previewImage = document.getElementById('preview-image');
const removeBtn = document.getElementById('remove-btn');
const resultsSection = document.getElementById('results-section');
const beverageCard = document.getElementById('beverage-card');

// Enhanced beverage database with top 100 beers, Australian beers, and alcohol percentages
const beverageDatabase = {
    // Top Rated Beers (1-25)
    'westvleteren12': {
        name: 'Westvleteren 12',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '10.2%',
        standardDrinks: '2.4',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Westmalle yeast'],
        description: 'Considered the world\'s best beer, this Trappist quadrupel from Belgium offers complex flavors of dark fruit, caramel, and spice. One 330ml bottle contains 2.4 standard drinks.',
        nutrition: {
            calories: 285,
            carbs: 28.5,
            protein: 2.8,
            fat: 0,
            sugar: 3.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Belgian', 'Trappist', 'Premium']
    },
    'plinytheyounger': {
        name: 'Pliny the Younger',
        type: 'Beer',
        alcohol: 'Triple IPA',
        abv: '10.25%',
        standardDrinks: '2.4',
        ingredients: ['Pale malt', 'Crystal malt', 'Amarillo hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A highly sought-after triple IPA from Russian River Brewing. Intensely hoppy with citrus and pine notes. One 500ml serving contains 2.4 standard drinks.',
        nutrition: {
            calories: 290,
            carbs: 29.2,
            protein: 2.9,
            fat: 0,
            sugar: 2.8,
            servingSize: '500ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Hoppy', 'Limited']
    },
    'headytopper': {
        name: 'Heady Topper',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Pale malt', 'Wheat malt', 'Amarillo hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A legendary double IPA from The Alchemist. Hazy, juicy, and intensely aromatic. One 473ml can contains 1.9 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 22.8,
            protein: 2.2,
            fat: 0,
            sugar: 2.1,
            servingSize: '473ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Hazy', 'Cult']
    },
    'kbs': {
        name: 'Kentucky Breakfast Stout (KBS)',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Chocolate', 'Bourbon barrel aged'],
        description: 'A bourbon barrel-aged imperial stout with coffee and chocolate notes. Rich and complex. One 355ml bottle contains 2.8 standard drinks.',
        nutrition: {
            calories: 335,
            carbs: 33.8,
            protein: 3.2,
            fat: 0,
            sugar: 4.2,
            servingSize: '355ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Coffee']
    },
    'cbs': {
        name: 'Canadian Breakfast Stout (CBS)',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.7%',
        standardDrinks: '2.7',
        ingredients: ['Chocolate malt', 'Coffee', 'Maple syrup', 'Bourbon barrel aged'],
        description: 'A maple syrup-infused bourbon barrel-aged imperial stout. Sweet and decadent. One 355ml bottle contains 2.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Maple']
    },
    'darklord': {
        name: 'Dark Lord',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '15.0%',
        standardDrinks: '3.5',
        ingredients: ['Chocolate malt', 'Coffee', 'Vanilla', 'Molasses'],
        description: 'A massive imperial stout from 3 Floyds. Thick, rich, and intensely flavorful. One 500ml bottle contains 3.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'High ABV', 'Limited']
    },
    'hunahpu': {
        name: 'Hunahpu\'s Imperial Stout',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.0%',
        standardDrinks: '2.6',
        ingredients: ['Chocolate malt', 'Cinnamon', 'Vanilla', 'Chili peppers', 'Cacao'],
        description: 'A complex imperial stout with cinnamon, vanilla, chili peppers, and cacao. Spicy and rich. One 500ml bottle contains 2.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Spicy', 'Complex']
    },
    'parabola': {
        name: 'Parabola',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '14.0%',
        standardDrinks: '3.3',
        ingredients: ['Chocolate malt', 'Bourbon barrel aged', 'Vanilla', 'Oak'],
        description: 'A bourbon barrel-aged imperial stout from Firestone Walker. Smooth and complex with vanilla and oak notes. One 355ml bottle contains 3.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Smooth']
    },
    'abyss': {
        name: 'The Abyss',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.1%',
        standardDrinks: '2.6',
        ingredients: ['Chocolate malt', 'Licorice', 'Vanilla', 'Oak barrel aged'],
        description: 'An oak barrel-aged imperial stout with licorice and vanilla notes. Deep and mysterious. One 500ml bottle contains 2.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Licorice']
    },
    'speedway': {
        name: 'Speedway Stout',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Oats', 'Wheat'],
        description: 'A coffee-infused imperial stout from AleSmith. Rich and smooth with prominent coffee notes. One 355ml bottle contains 2.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Coffee', 'Rich']
    },
    'guinness': {
        name: 'Guinness Draught',
        type: 'Beer',
        alcohol: 'Dry Stout',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast', 'Nitrogen'],
        description: 'A classic Irish dry stout with a creamy head and smooth finish. One 440ml can contains 1.0 standard drink.',
        nutrition: {
            calories: 125,
            carbs: 10.5,
            protein: 1.5,
            fat: 0,
            sugar: 0.8,
            servingSize: '440ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Irish', 'Classic', 'Creamy']
    },
    'duvel': {
        name: 'Duvel',
        type: 'Beer',
        alcohol: 'Belgian Strong Golden Ale',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Saaz hops', 'Duvel yeast'],
        description: 'A classic Belgian strong golden ale with fruity esters and spicy hop character. One 330ml bottle contains 2.0 standard drinks.',
        nutrition: {
            calories: 240,
            carbs: 24.2,
            protein: 2.4,
            fat: 0,
            sugar: 2.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Belgian', 'Strong', 'Classic']
    },
    'chimay': {
        name: 'Chimay Blue',
        type: 'Beer',
        alcohol: 'Belgian Strong Dark Ale',
        abv: '9.0%',
        standardDrinks: '2.1',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Chimay yeast'],
        description: 'A Trappist strong dark ale with complex dark fruit and spice notes. One 330ml bottle contains 2.1 standard drinks.',
        nutrition: {
            calories: 255,
            carbs: 25.8,
            protein: 2.5,
            fat: 0,
            sugar: 3.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Dark Ale', 'Belgian', 'Trappist', 'Complex']
    },
    'rochefort10': {
        name: 'Rochefort 10',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '11.3%',
        standardDrinks: '2.7',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Rochefort yeast'],
        description: 'A Trappist quadrupel with rich dark fruit, caramel, and spice flavors. One 330ml bottle contains 2.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Belgian', 'Trappist', 'Rich']
    },
    'orval': {
        name: 'Orval',
        type: 'Beer',
        alcohol: 'Belgian Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Pilsner malt', 'Hallertau hops', 'Orval yeast', 'Brettanomyces'],
        description: 'A unique Trappist ale with Brettanomyces for complex, funky flavors. One 330ml bottle contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Belgian', 'Trappist', 'Funky']
    },
    'laTrappe': {
        name: 'La Trappe Quadrupel',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '10.0%',
        standardDrinks: '2.4',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'La Trappe yeast'],
        description: 'A Dutch Trappist quadrupel with rich malt and dark fruit character. One 330ml bottle contains 2.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Dutch', 'Trappist', 'Rich']
    },
    'saisonDupont': {
        name: 'Saison Dupont',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Pilsner malt', 'Wheat malt', 'Styrian Golding hops', 'Saison yeast'],
        description: 'A classic Belgian saison with spicy, fruity, and earthy notes. One 330ml bottle contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Belgian', 'Classic', 'Spicy']
    },
    'pilsnerUrquell': {
        name: 'Pilsner Urquell',
        type: 'Beer',
        alcohol: 'Czech Pilsner',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Pilsner malt', 'Saaz hops', 'Czech water', 'Lager yeast'],
        description: 'The original Czech pilsner with noble hop character and crisp finish. One 330ml bottle contains 1.0 standard drink.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'Czech', 'Classic', 'Crisp']
    },
    'weihenstephaner': {
        name: 'Weihenstephaner Hefeweissbier',
        type: 'Beer',
        alcohol: 'German Hefeweizen',
        abv: '5.4%',
        standardDrinks: '1.3',
        ingredients: ['Wheat malt', 'Barley malt', 'Hallertau hops', 'Hefeweizen yeast'],
        description: 'A classic German hefeweizen with banana and clove notes. One 500ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'German', 'Classic', 'Banana']
    },
    'averyMaharaja': {
        name: 'The Maharaja',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '10.2%',
        standardDrinks: '2.4',
        ingredients: ['Pale malt', 'Crystal malt', 'Columbus hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A bold imperial IPA with intense hop character and malt backbone. One 650ml bottle contains 2.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Imperial', 'Hoppy']
    },
    'dogfish120': {
        name: '120 Minute IPA',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '18.0%',
        standardDrinks: '4.2',
        ingredients: ['Pale malt', 'Crystal malt', 'Warrior hops', 'Amarillo hops', 'Simcoe hops'],
        description: 'An extreme imperial IPA with massive hop character and high alcohol content. One 355ml bottle contains 4.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Extreme', 'High ABV']
    },
    'foundersKBS': {
        name: 'Founders KBS',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Chocolate', 'Bourbon barrel aged'],
        description: 'A bourbon barrel-aged imperial stout with coffee and chocolate notes. Rich and complex. One 355ml bottle contains 2.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Coffee']
    },
    'bellstwohearted': {
        name: 'Two Hearted Ale',
        type: 'Beer',
        alcohol: 'American IPA',
        abv: '7.0%',
        standardDrinks: '1.7',
        ingredients: ['Pale malt', 'Crystal malt', 'Centennial hops'],
        description: 'A balanced American IPA with citrus and pine hop character. One 355ml bottle contains 1.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Balanced', 'Classic']
    },
    'sierraNevadaPale': {
        name: 'Sierra Nevada Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.6%',
        standardDrinks: '1.3',
        ingredients: ['Pale malt', 'Crystal malt', 'Cascade hops'],
        description: 'The classic American pale ale that started the craft beer revolution. One 355ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'American', 'Classic', 'Cascade']
    },
    'samuelAdamsBoston': {
        name: 'Samuel Adams Boston Lager',
        type: 'Beer',
        alcohol: 'Vienna Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Vienna malt', 'Caramel malt', 'Hallertau hops', 'Tettnang hops'],
        description: 'A classic Vienna lager with balanced malt and hop character. One 355ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'American', 'Classic', 'Balanced']
    },
    'blueMoon': {
        name: 'Blue Moon Belgian White',
        type: 'Beer',
        alcohol: 'Belgian Witbier',
        abv: '5.4%',
        standardDrinks: '1.3',
        ingredients: ['Wheat malt', 'Barley malt', 'Orange peel', 'Coriander', 'Hallertau hops'],
        description: 'A Belgian-style witbier with orange peel and coriander notes. One 355ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Witbier', 'American', 'Belgian-style', 'Orange']
    },

    // Australian & New Zealand Beers (Available at Dan Murphy's)
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a crisp, clean taste. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 12.8,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, known for its distinctive bitter taste. One 375ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Popular', 'Classic']
    },
    'x-gold': {
        name: 'XXXX Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager from Queensland, perfect for extended drinking sessions. One 375ml bottle contains 0.8 standard drinks.',
        nutrition: {
            calories: 105,
            carbs: 9.8,
            protein: 0.9,
            fat: 0,
            sugar: 0.3,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Queensland']
    },
    'crown-lager': {
        name: 'Crown Lager',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s premium lager with a smooth, full-bodied taste. One 375ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 148,
            carbs: 13.5,
            protein: 1.3,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Smooth']
    },
    'coopers-pale-ale': {
        name: 'Coopers Pale Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A naturally cloudy pale ale with distinctive fruity characters. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Cloudy', 'Fruity']
    },
    'coopers-sparkling-ale': {
        name: 'Coopers Sparkling Ale',
        type: 'Beer',
        alcohol: 'Australian Sparkling Ale',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Australian sparkling ale with natural sediment. One 375ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 16.8,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sparkling Ale', 'Australian', 'Traditional', 'Sediment']
    },
    'little-creatures-pale-ale': {
        name: 'Little Creatures Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A hoppy American-style pale ale with citrus and floral notes. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Hoppy', 'Citrus']
    },
    'stone-wood-pacific-ale': {
        name: 'Stone & Wood Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical fruit-forward pale ale with Galaxy hops. One 330ml bottle contains 1.0 standard drink.',
        nutrition: {
            calories: 132,
            carbs: 12.8,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Galaxy Hops']
    },
    'balter-xpa': {
        name: 'Balter XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable extra pale ale with tropical and citrus hop character. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'balter-ipa': {
        name: 'Balter IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. One 330ml can contains 1.5 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 18.2,
            protein: 1.8,
            fat: 0,
            sugar: 0.9,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'young-henrys-newtowner': {
        name: 'Young Henrys Newtowner',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable pale ale with balanced malt and hop character. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Sessionable', 'Balanced']
    },
    'modus-operandi-former-tenant': {
        name: 'Modus Operandi Former Tenant',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.2,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Hazy', 'Tropical']
    },
    'hop-nation-rattenhund': {
        name: 'Hop Nation Rattenhund',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Juicy', 'Tropical']
    },
    'garage-project-hazy-daze': {
        name: 'Garage Project Hazy Daze',
        type: 'Beer',
        alcohol: 'New England IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy New England-style IPA with tropical fruit notes. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Hazy', 'Tropical']
    },
    'epic-armageddon': {
        name: 'Epic Armageddon',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.66%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and high alcohol content. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 200,
            carbs: 20.2,
            protein: 2.0,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'High ABV']
    },
    'yeastie-boys-gunnamatta': {
        name: 'Yeastie Boys Gunnamatta',
        type: 'Beer',
        alcohol: 'Earl Grey IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Earl Grey tea', 'Citra hops', 'Water', 'Yeast'],
        description: 'An Earl Grey tea-infused IPA with citrus and bergamot notes. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Tea-infused', 'Bergamot']
    },

    // Top 50 Australian Beers (1-25)
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a crisp, clean taste. One 375ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, a full-bodied lager with a distinctive taste. One 375ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Popular', 'Full-bodied']
    },
    'coopers-pale-ale': {
        name: 'Coopers Pale Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A naturally cloudy pale ale with a distinctive fruity character. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Cloudy', 'Fruity']
    },
    'coopers-sparkling-ale': {
        name: 'Coopers Sparkling Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bottle-conditioned pale ale with natural carbonation and complex flavors. One 375ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 16.8,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Bottle-conditioned', 'Complex']
    },
    'coopers-best-extra-stout': {
        name: 'Coopers Best Extra Stout',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '6.3%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A rich, dark stout with coffee and chocolate notes. One 375ml bottle contains 1.5 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 18.2,
            protein: 1.8,
            fat: 0,
            sugar: 0.9,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Rich']
    },
    'stone-wood-pacific-ale': {
        name: 'Stone & Wood Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A refreshing pale ale with tropical fruit notes from Galaxy hops. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 132,
            carbs: 12.8,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Refreshing']
    },
    'stone-wood-green-coast-lager': {
        name: 'Stone & Wood Green Coast Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, crisp lager with subtle hop character. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Crisp']
    },
    'balter-xpa': {
        name: 'Balter XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable extra pale ale with tropical and citrus hop character. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'balter-ipa': {
        name: 'Balter IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'young-henrys-newtowner': {
        name: 'Young Henrys Newtowner',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable pale ale with balanced malt and hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Sessionable', 'Balanced']
    },
    'young-henrys-natural-lager': {
        name: 'Young Henrys Natural Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, natural lager with subtle hop character. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 128,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Natural']
    },
    'modus-operandi-former-tenant': {
        name: 'Modus Operandi Former Tenant',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Hazy', 'Tropical']
    },
    'modus-operandi-silent-knight': {
        name: 'Modus Operandi Silent Knight',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'hop-nation-rattenhund': {
        name: 'Hop Nation Rattenhund',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Juicy', 'Tropical']
    },
    'hop-nation-the-wolf': {
        name: 'Hop Nation The Wolf',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold double IPA with intense hop character and high alcohol content. One 330ml can contains 1.9 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 22.8,
            protein: 2.2,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'Australian', 'Bold', 'High ABV']
    },
    'garage-project-hazy-daze': {
        name: 'Garage Project Hazy Daze',
        type: 'Beer',
        alcohol: 'New England IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy New England-style IPA with tropical fruit notes. One 330ml can contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Hazy', 'Tropical']
    },
    'garage-project-death-from-above': {
        name: 'Garage Project Death From Above',
        type: 'Beer',
        alcohol: 'Mango IPA',
        abv: '7.0%',
        standardDrinks: '1.7',
        ingredients: ['Malted barley', 'Mango', 'Citra hops', 'Water', 'Yeast'],
        description: 'A mango-infused IPA with tropical fruit character. One 330ml can contains 1.7 standard drinks.',
        nutrition: {
            calories: 205,
            carbs: 20.5,
            protein: 2.0,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Mango', 'Tropical']
    },
    'epic-armageddon': {
        name: 'Epic Armageddon',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.66%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and high alcohol content. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'High ABV']
    },
    'epic-hop-zombie': {
        name: 'Epic Hop Zombie',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A massive double IPA with intense hop character and high alcohol content. One 330ml bottle contains 2.0 standard drinks.',
        nutrition: {
            calories: 240,
            carbs: 24.2,
            protein: 2.4,
            fat: 0,
            sugar: 1.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'New Zealand', 'Massive', 'High ABV']
    },
    'yeastie-boys-gunnamatta': {
        name: 'Yeastie Boys Gunnamatta',
        type: 'Beer',
        alcohol: 'Earl Grey IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Earl Grey tea', 'Citra hops', 'Water', 'Yeast'],
        description: 'An Earl Grey tea-infused IPA with citrus and bergamot notes. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Tea-infused', 'Bergamot']
    },
    'yeastie-boys-pot-kettle-black': {
        name: 'Yeastie Boys Pot Kettle Black',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A rich porter with coffee and chocolate notes. One 330ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.8,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'New Zealand', 'Rich', 'Dark']
    },
    'little-creatures-pale-ale': {
        name: 'Little Creatures Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'little-creatures-bright-ale': {
        name: 'Little Creatures Bright Ale',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bright, golden ale with subtle hop character. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Bright', 'Golden']
    },
    'little-creatures-dog-days': {
        name: 'Little Creatures Dog Days',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical fruit hop character. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'mountain-goat-steam-ale': {
        name: 'Mountain Goat Steam Ale',
        type: 'Beer',
        alcohol: 'California Common',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Northern Brewer hops', 'Water', 'Yeast'],
        description: 'A California common-style beer with caramel malt character. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'California Common', 'Australian', 'Caramel', 'Smooth']
    },
    'mountain-goat-hightail-ale': {
        name: 'Mountain Goat Hightail Ale',
        type: 'Beer',
        alcohol: 'English Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'East Kent Golding hops', 'Water', 'Yeast'],
        description: 'An English-style pale ale with balanced malt and hop character. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'English Pale Ale', 'Australian', 'Balanced', 'Traditional']
    },
    'mountain-goat-fancy-pants': {
        name: 'Mountain Goat Fancy Pants',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bright, golden ale with subtle hop character. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Bright', 'Golden']
    },

    // Top 50 Australian Beers (26-50)
    '4-pines-pale-ale': {
        name: '4 Pines Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.1%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    '4-pines-kolsch': {
        name: '4 Pines Kölsch',
        type: 'Beer',
        alcohol: 'Kölsch',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A German-style Kölsch with clean, crisp character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Kölsch', 'Australian', 'Clean', 'Crisp']
    },
    '4-pines-hefeweizen': {
        name: '4 Pines Hefeweizen',
        type: 'Beer',
        alcohol: 'Hefeweizen',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Wheat malt', 'Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A German-style wheat beer with banana and clove notes. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'Australian', 'Wheat', 'Banana']
    },
    'bridge-road-brewers-chevalier-saison': {
        name: 'Bridge Road Brewers Chevalier Saison',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Wheat malt', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style saison with spicy and fruity character. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Australian', 'Spicy', 'Fruity']
    },
    'bridge-road-brewers-beechworth-pale-ale': {
        name: 'Bridge Road Brewers Beechworth Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'bridge-road-brewers-robust-porter': {
        name: 'Bridge Road Brewers Robust Porter',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A rich porter with coffee and chocolate notes. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Australian', 'Rich', 'Dark']
    },
    'foghorn-breakwater-pale-ale': {
        name: 'Foghorn Breakwater Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'foghorn-redhead-red-ale': {
        name: 'Foghorn Redhead Red Ale',
        type: 'Beer',
        alcohol: 'Red Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich red ale with caramel malt character. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Red Ale', 'Australian', 'Rich', 'Caramel']
    },
    'foghorn-black-sheep-stout': {
        name: 'Foghorn Black Sheep Stout',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'hawkers-pale-ale': {
        name: 'Hawkers Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'hawkers-ipa': {
        name: 'Hawkers IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'hawkers-lager': {
        name: 'Hawkers Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, crisp lager with subtle hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Crisp']
    },
    'akasha-brewing-hopsmith-ipa': {
        name: 'Akasha Brewing Hopsmith IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'akasha-brewing-freshwater-pale-ale': {
        name: 'Akasha Brewing Freshwater Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'akasha-brewing-5oclock-shadow': {
        name: 'Akasha Brewing 5 O\'Clock Shadow',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. One 330ml can contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'batch-brewing-west-coast-ipa': {
        name: 'Batch Brewing West Coast IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold West Coast-style IPA with intense hop character. One 330ml can contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'West Coast']
    },
    'batch-brewing-saison': {
        name: 'Batch Brewing Saison',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Wheat malt', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style saison with spicy and fruity character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Australian', 'Spicy', 'Fruity']
    },
    'batch-brewing-pale-ale': {
        name: 'Batch Brewing Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'wayward-brewing-raspberry-berliner-weisse': {
        name: 'Wayward Brewing Raspberry Berliner Weisse',
        type: 'Beer',
        alcohol: 'Berliner Weisse',
        abv: '3.2%',
        standardDrinks: '0.8',
        ingredients: ['Wheat malt', 'Malted barley', 'Raspberries', 'Water', 'Yeast'],
        description: 'A tart Berliner Weisse with raspberry character. One 330ml can contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Berliner Weisse', 'Australian', 'Tart', 'Raspberry']
    },
    'wayward-brewing-charlie-ipa': {
        name: 'Wayward Brewing Charlie IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'wayward-brewing-sour-puss': {
        name: 'Wayward Brewing Sour Puss',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Australian', 'Tart', 'Refreshing']
    },
    'nomad-brewing-long-trip-saison': {
        name: 'Nomad Brewing Long Trip Saison',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Wheat malt', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style saison with spicy and fruity character. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Australian', 'Spicy', 'Fruity']
    },
    'nomad-brewing-smooth-criminal': {
        name: 'Nomad Brewing Smooth Criminal',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A smooth porter with coffee and chocolate notes. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Australian', 'Smooth', 'Dark']
    },
    'nomad-brewing-freshie-salt-&-pepper-gose': {
        name: 'Nomad Brewing Freshie Salt & Pepper Gose',
        type: 'Beer',
        alcohol: 'Gose',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Salt', 'Coriander', 'Water', 'Yeast'],
        description: 'A tart gose with salt and pepper character. One 330ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Gose', 'Australian', 'Tart', 'Salty']
    },
    'bentspoke-crankshaft-ipa': {
        name: 'BentSpoke Crankshaft IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'bentspoke-barley-griffin': {
        name: 'BentSpoke Barley Griffin',
        type: 'Beer',
        alcohol: 'Barley Wine',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich barley wine with complex malt character. One 330ml can contains 2.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Barley Wine', 'Australian', 'Rich', 'Complex']
    },
    'bentspoke-sprocket-red-ipa': {
        name: 'BentSpoke Sprocket Red IPA',
        type: 'Beer',
        alcohol: 'Red IPA',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Crystal malt', 'Citra hops', 'Water', 'Yeast'],
        description: 'A red IPA with caramel malt and hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Red IPA', 'Australian', 'Caramel', 'Hoppy']
    },
    'capital-brewing-rock-hopper-ipa': {
        name: 'Capital Brewing Rock Hopper IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'capital-brewing-trail-pale-ale': {
        name: 'Capital Brewing Trail Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'capital-brewing-cosmic-crush-sour': {
        name: 'Capital Brewing Cosmic Crush Sour',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Australian', 'Tart', 'Refreshing']
    },

    // Additional Australian Beer Companies and Variations
    'asahi': {
        name: 'Asahi Super Dry',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A crisp, dry Japanese lager with a clean finish. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Crisp', 'Dry']
    },
    'asahi-mid-strength': {
        name: 'Asahi Mid Strength',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Asahi Super Dry with the same crisp character. One 330ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Mid-strength', 'Crisp']
    },
    'asahi-zero': {
        name: 'Asahi Zero',
        type: 'Beer',
        alcohol: 'Non-Alcoholic Lager',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A non-alcoholic version of Asahi Super Dry with the same crisp taste. One 330ml bottle contains 0.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Non-alcoholic', 'Crisp']
    },
    'asahi-500ml': {
        name: 'Asahi Super Dry 500ml',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '5.0%',
        standardDrinks: '1.8',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A larger serving of Asahi Super Dry in a 500ml can. One 500ml can contains 1.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Crisp', 'Large Format']
    },
    'ballarat-bitter': {
        name: 'Ballarat Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Australian bitter from Ballarat. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Traditional', 'Victorian']
    },
    'balter-brewing': {
        name: 'Balter Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Gold Coast craft brewery known for their XPA and IPA varieties. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Gold Coast', 'Modern']
    },
    'bentspoke-brewing': {
        name: 'BentSpoke Brewing Co',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Canberra craft brewery known for their innovative beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Canberra', 'Innovative']
    },
    'bluetongue-brewery': {
        name: 'Bluetongue Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Hunter Valley craft brewery with a range of traditional and modern beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Hunter Valley', 'Traditional']
    },
    'boags-brewery': {
        name: 'Boag\'s Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Tasmanian brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Tasmanian', 'Premium']
    },
    'bondi-blonde': {
        name: 'Bondi Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager inspired by the Bondi lifestyle. One 330ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Refreshing']
    },
    'bootleg-brewery': {
        name: 'Bootleg Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their unique beer styles and barrel-aged offerings. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Barrel-aged']
    },
    'john-boston': {
        name: 'John Boston',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a rich history. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Historical']
    },
    'brisbane-bitter': {
        name: 'Brisbane Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Queensland bitter with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Queensland', 'Traditional']
    },
    'broo-brewery': {
        name: 'Broo Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A craft brewery known for their innovative brewing techniques and sustainable practices. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Innovative', 'Sustainable']
    },
    'burleigh-brewing': {
        name: 'Burleigh Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Gold Coast craft brewery known for their tropical-inspired beers and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Gold Coast', 'Tropical']
    },
    'capital-brewing-company': {
        name: 'Capital Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Canberra craft brewery known for their sessionable beers and community focus. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Canberra', 'Sessionable']
    },
    'carlton-united-breweries': {
        name: 'Carlton & United Breweries',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'One of Australia\'s largest brewing companies, producing a wide range of popular beer brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Popular', 'Wide Range']
    },
    'carlton-black': {
        name: 'Carlton Black',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager with a smooth, easy-drinking character. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Smooth']
    },
    'carlton-cold': {
        name: 'Carlton Cold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A refreshing mid-strength lager designed to be served cold. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Refreshing']
    },
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a crisp, clean taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'carlton-dry': {
        name: 'Carlton Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dry, crisp lager with a clean finish. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'carlton-midstrength': {
        name: 'Carlton Midstrength',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager with a smooth, easy-drinking character. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Smooth']
    },
    'carlton-zero': {
        name: 'Carlton Zero',
        type: 'Beer',
        alcohol: 'Non-Alcoholic Lager',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A non-alcoholic lager with the same crisp taste as Carlton Draught. One 375ml bottle contains 0.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Non-alcoholic', 'Crisp']
    },
    'cascade-brewery': {
        name: 'Cascade Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A historic Tasmanian brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Tasmanian', 'Historic']
    },
    'castlemaine-brewery': {
        name: 'Castlemaine Brewery, Western Australia',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a focus on traditional brewing techniques. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Traditional']
    },
    'castlemaine-perkins': {
        name: 'Castlemaine Perkins',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland brewery known for their XXXX brand and other popular beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Queensland', 'XXXX']
    },
    'cbco-brewing': {
        name: 'CBCo Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Innovative', 'Quality']
    },
    'coopers-brewery': {
        name: 'Coopers Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian family-owned brewery known for their traditional brewing methods and cloudy beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'Family-owned']
    },
    'crown-lager': {
        name: 'Crown Lager',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s premium lager with a smooth, full-bodied taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Smooth']
    },
    'emu-beer': {
        name: 'Emu (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Distinctive']
    },
    'emu-brewery': {
        name: 'Emu Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a focus on traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Traditional']
    },
    'feral-brewing': {
        name: 'Feral Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their bold, hoppy beers and innovative styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Bold']
    },
    'fosters-lager': {
        name: 'Foster\'s Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'An internationally recognized Australian lager with a light, refreshing taste. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'International', 'Light']
    },
    'gage-roads-brew': {
        name: 'Gage Roads Brew Co',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'great-northern-brewing': {
        name: 'Great Northern Brewing Co.',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland craft brewery known for their tropical-inspired beers and sessionable styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Queensland', 'Tropical']
    },
    'hahn-brewery': {
        name: 'Hahn Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their premium lagers and innovative beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Premium']
    },
    'holgate-brewhouse': {
        name: 'Holgate Brewhouse',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their traditional brewing methods and quality beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Traditional']
    },
    'james-boags-premium': {
        name: 'James Boag\'s Premium',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A premium Tasmanian lager with a smooth, full-bodied taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Tasmanian']
    },
    'kalgoorlie-brewing': {
        name: 'Kalgoorlie Brewing and Ice Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a rich mining history. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Historic']
    },
    'kb-lager': {
        name: 'KB Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Distinctive']
    },
    'lion-brewing': {
        name: 'Lion Brewing and Malting Company',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'One of Australia\'s largest brewing companies, producing a wide range of popular beer brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Popular', 'Wide Range']
    },
    'little-creatures-brewery': {
        name: 'Little Creatures Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'lobethal-bierhaus': {
        name: 'Lobethal Bierhaus',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian craft brewery known for their traditional German-style beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'German-style']
    },
    'malt-shovel-brewery': {
        name: 'Malt Shovel Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their James Squire range of beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'James Squire']
    },
    'mash-brewing': {
        name: 'Mash Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'matilda-bay-brewing': {
        name: 'Matilda Bay Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'melbourne-bitter': {
        name: 'Melbourne Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Victorian bitter with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Victorian', 'Traditional']
    },
    'mountain-goat-beer': {
        name: 'Mountain Goat Beer',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Innovative']
    },
    'nail-brewing': {
        name: 'Nail Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'nt-draught': {
        name: 'NT Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Northern Territory lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Northern Territory', 'Distinctive']
    },
    'pirate-life-brewing': {
        name: 'Pirate Life Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian craft brewery known for their bold, hoppy beers and innovative styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'Bold']
    },
    'pure-blonde': {
        name: 'Pure Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A low-carb mid-strength lager with a light, refreshing taste. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Low-carb', 'Mid-strength']
    },
    'queensland-brewery': {
        name: 'Queensland Brewery Ltd',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Queensland', 'Historic']
    },
    'reschs': {
        name: 'Resch\'s',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic New South Wales lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'New South Wales', 'Classic']
    },
    'skinny-blonde': {
        name: 'Skinny Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A low-carb mid-strength lager with a light, refreshing taste. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Low-carb', 'Mid-strength']
    },
    'south-australian-brewing': {
        name: 'South Australian Brewing Company',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'South Australia', 'Historic']
    },
    'southwark-bitter': {
        name: 'Southwark Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional South Australian bitter with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'South Australia', 'Traditional']
    },
    'st-arnou': {
        name: 'St Arnou',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Premium']
    },
    'stone-wood-brewing': {
        name: 'Stone & Wood Brewing Co.',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their Pacific Ale and other innovative beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Pacific Ale']
    },
    'swan-beer': {
        name: 'Swan (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Western Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Western Australia', 'Classic']
    },
    'swan-brewery': {
        name: 'Swan Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Historic']
    },
    'thunder-road-brewing': {
        name: 'Thunder Road Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Innovative']
    },
    'tooheys-brewery': {
        name: 'Tooheys Brewery',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales brewery known for their popular Tooheys New and Old brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'New South Wales', 'Popular']
    },
    'tooheys-extra-dry': {
        name: 'Tooheys Extra Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dry, crisp lager with a clean finish. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'tooheys-new': {
        name: 'Tooheys New',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic New South Wales lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'New South Wales', 'Classic']
    },
    'tooheys-old': {
        name: 'Tooheys Old',
        type: 'Beer',
        alcohol: 'Australian Dark Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dark lager with a rich, malty taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Dark Lager', 'Australian', 'Rich', 'Malty']
    },
    'tooth-and-co': {
        name: 'Tooth and Co.',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A historic New South Wales brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'New South Wales', 'Historic']
    },
    'vb-gold': {
        name: 'VB Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Victoria Bitter with the same distinctive taste. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'VB']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, known for its distinctive bitter taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Popular', 'Classic']
    },
    'west-end-draught': {
        name: 'West End Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic South Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'South Australia', 'Classic']
    },
    'xxxx-beer': {
        name: 'XXXX (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Queensland lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Queensland', 'Classic']
    },
    'xxxx-gold': {
        name: 'XXXX Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager from Queensland, perfect for extended drinking sessions. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Queensland']
    },
    'xxxx-summer-bright': {
        name: 'XXXX Summer Bright Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager perfect for summer drinking. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Summer']
    },
    'yatala-brewery': {
        name: 'Yatala Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland craft brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Queensland', 'Historic']
    },
    'young-henrys': {
        name: 'Young Henrys',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Innovative']
    },

    // Additional Beer Varieties and Specific Brands
    'pale-ale': {
        name: 'Pale Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A classic pale ale with balanced hop and malt character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Classic', 'Balanced', 'Hoppy']
    },
    'pacific-ale': {
        name: 'Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. One 330ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Galaxy Hops']
    },
    'little-hazy': {
        name: 'Little Hazy',
        type: 'Beer',
        alcohol: 'Hazy Pale Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable hazy pale ale with a smooth, cloudy appearance and tropical hop character. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy Pale Ale', 'Sessionable', 'Tropical', 'Smooth']
    },
    'hazy-ipa': {
        name: 'Hazy IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy hazy IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy IPA', 'Juicy', 'Tropical', 'Citrus']
    },
    'juicy-xpa': {
        name: 'Juicy XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy extra pale ale with tropical fruit and citrus hop character. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Juicy', 'Tropical', 'Citrus']
    },
    'rogers-amber': {
        name: 'Rogers\' Amber',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '3.8%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength amber ale with caramel malt character and balanced hop bitterness. One 330ml bottle contains 0.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Mid-strength', 'Caramel', 'Balanced']
    },
    'single-fin': {
        name: 'Single Fin',
        type: 'Beer',
        alcohol: 'Blonde Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth blonde ale with a clean, crisp finish. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Blonde Ale', 'Smooth', 'Clean', 'Crisp']
    },
    'air-time': {
        name: 'Air Time',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical hop character and easy-drinking profile. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Tropical', 'Sessionable', 'Hoppy']
    },
    'pipe-dreams': {
        name: 'Pipe Dreams',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic pale ale with citrus hop character and balanced malt profile. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Classic', 'Citrus', 'Balanced']
    },
    'side-track': {
        name: 'Side Track',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A golden ale with a bright, refreshing character and subtle hop notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Bright', 'Refreshing', 'Subtle']
    },
    'hazy-as': {
        name: 'Hazy As',
        type: 'Beer',
        alcohol: 'Hazy IPA',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy IPA', 'Tropical', 'Citrus', 'Juicy']
    },
    'yeah-buoy': {
        name: 'Yeah Buoy',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Tropical', 'Galaxy Hops', 'Passionfruit']
    },
    'pinkys-sunset': {
        name: 'Pinky\'s Sunset',
        type: 'Cider',
        alcohol: 'Apple Cider',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Apple juice', 'Yeast', 'Natural flavors'],
        description: 'A refreshing apple cider with natural fruit flavors. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Cider', 'Apple', 'Refreshing', 'Natural', 'Fruity']
    },
    'hop-hog': {
        name: 'Hop Hog',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'biggie-juice': {
        name: 'Biggie Juice',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A big, juicy double IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'Juicy', 'Tropical', 'High ABV']
    },
    'war-hog': {
        name: 'War Hog',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '8.8%',
        standardDrinks: '2.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'An imperial IPA with massive hop character and tropical fruit notes. One 330ml bottle contains 2.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Imperial IPA', 'Massive', 'Hoppy', 'Tropical']
    },
    'raging-flem': {
        name: 'Raging Flem',
        type: 'Beer',
        alcohol: 'Belgian Strong Ale',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Belgian yeast', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style strong ale with complex flavors and high alcohol content. One 330ml bottle contains 2.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Belgian Strong Ale', 'Complex', 'High ABV', 'Belgian-style']
    },
    'feral-white': {
        name: 'Feral White',
        type: 'Beer',
        alcohol: 'Wheat Beer',
        abv: '4.7%',
        standardDrinks: '1.1',
        ingredients: ['Wheat malt', 'Malted barley', 'Coriander', 'Orange peel', 'Water', 'Yeast'],
        description: 'A Belgian-style wheat beer with coriander and orange peel. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Wheat Beer', 'Belgian-style', 'Coriander', 'Orange']
    },
    'golden-ace': {
        name: 'Golden Ace',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A golden ale with a bright, refreshing character and subtle hop notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Bright', 'Refreshing', 'Subtle']
    },
    'smoked-porter': {
        name: 'Smoked Porter',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Smoked malt', 'Chocolate malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich porter with smoky character and chocolate malt notes. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Smoky', 'Rich', 'Chocolate']
    },
    'watermelon-warhead': {
        name: 'Watermelon Warhead',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Watermelon', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with watermelon character and refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Watermelon', 'Tart', 'Refreshing']
    },
    'runt': {
        name: 'Runt',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '3.8%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical hop character and low alcohol content. One 330ml can contains 0.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Tropical', 'Sessionable', 'Low ABV']
    },
    'rust': {
        name: 'Rust',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'An amber ale with caramel malt character and balanced hop bitterness. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Caramel', 'Balanced', 'Malty']
    },
    'karma-citra': {
        name: 'Karma Citra',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Water', 'Yeast'],
        description: 'An IPA showcasing Citra hops with intense citrus and tropical fruit character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Citra Hops', 'Citrus', 'Tropical']
    },
    'fantapants': {
        name: 'Fantapants',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Tropical', 'Galaxy Hops', 'Passionfruit']
    },
    'razorback': {
        name: 'Razorback',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'boris': {
        name: 'Boris',
        type: 'Beer',
        alcohol: 'Russian Imperial Stout',
        abv: '9.0%',
        standardDrinks: '2.1',
        ingredients: ['Malted barley', 'Chocolate malt', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A rich Russian imperial stout with chocolate and coffee notes. One 330ml bottle contains 2.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Russian Imperial Stout', 'Rich', 'Chocolate', 'Coffee']
    },
    'amber': {
        name: 'Amber',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A classic amber ale with caramel malt character and balanced hop bitterness. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Classic', 'Caramel', 'Balanced']
    },
    'bfh': {
        name: 'B.F.H',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'white-hog': {
        name: 'White Hog',
        type: 'Beer',
        alcohol: 'Wheat Beer',
        abv: '4.7%',
        standardDrinks: '1.1',
        ingredients: ['Wheat malt', 'Malted barley', 'Coriander', 'Orange peel', 'Water', 'Yeast'],
        description: 'A Belgian-style wheat beer with coriander and orange peel. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Wheat Beer', 'Belgian-style', 'Coriander', 'Orange']
    },
    'matsos-ginger-beer': {
        name: 'Matsos Ginger Beer',
        type: 'Non-Alcoholic',
        alcohol: 'Ginger Beer',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Ginger', 'Sugar', 'Water', 'Natural flavors'],
        description: 'A refreshing non-alcoholic ginger beer with natural ginger flavor. One 330ml bottle contains 0.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Non-Alcoholic', 'Ginger Beer', 'Refreshing', 'Natural', 'Spicy']
    },
    'swan-draught': {
        name: 'Swan Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Western Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Western Australia', 'Classic']
    },
    'carlton-dry': {
        name: 'Carlton Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dry, crisp lager with a clean finish. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'great-northern': {
        name: 'Great Northern',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager perfect for hot weather. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.2,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Refreshing']
    },
    'great-northern-mid': {
        name: 'Great Northern Mid',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Great Northern with the same refreshing character. One 330ml bottle contains 0.8 standard drinks.',
        nutrition: {
            calories: 100,
            carbs: 9.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Refreshing']
    },
    'varsity-lager': {
        name: 'Varsity Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A premium Australian lager with a crisp, clean taste and smooth finish. Perfect for any occasion. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 12.8,
            protein: 1.3,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Crisp', 'Clean']
    },
    'sommersby': {
        name: 'Sommersby',
        type: 'Cider',
        alcohol: 'Apple Cider',
        abv: '4.5%',
        standardDrinks: '1.2',
        ingredients: ['Apple juice', 'Water', 'Sugar', 'Yeast', 'Natural flavors'],
        description: 'A refreshing apple cider with a crisp, fruity taste. Light and easy to drink. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 15.2,
            protein: 0.1,
            fat: 0,
            sugar: 12.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cider', 'Apple', 'Refreshing', 'Fruity', 'Light']
    },
    'minus196-premix': {
        name: '-196 Premix',
        type: 'RTD',
        alcohol: 'Vodka',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Vodka', 'Natural flavors', 'Carbonated water', 'Sugar', 'Citric acid'],
        description: 'A premium ready-to-drink vodka premix with natural flavors. Smooth and refreshing. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 16.5,
            protein: 0,
            fat: 0,
            sugar: 14.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Vodka', 'Premix', 'Premium', 'Smooth']
    },
    'hard-solo': {
        name: 'Hard Solo',
        type: 'RTD',
        alcohol: 'Vodka',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Vodka', 'Lemon flavoring', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A hard lemonade version of the classic Solo soft drink. Tangy and refreshing with a kick. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 15.8,
            protein: 0,
            fat: 0,
            sugar: 13.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['RTD', 'Vodka', 'Lemon', 'Tangy', 'Refreshing']
    },
    'bundaberg-rum-cola': {
        name: 'Bundaberg Rum & Cola',
        type: 'RTD',
        alcohol: 'Rum',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Bundaberg Rum', 'Cola', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A classic rum and cola premix featuring Bundaberg Rum. Sweet and smooth with a distinctive rum flavor. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 18.2,
            protein: 0,
            fat: 0,
            sugar: 16.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Rum', 'Cola', 'Bundaberg', 'Classic']
    },
    'jack-daniels-cola': {
        name: 'Jack Daniels & Cola',
        type: 'RTD',
        alcohol: 'Whiskey',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Jack Daniels Tennessee Whiskey', 'Cola', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A premium whiskey and cola premix featuring Jack Daniels. Smooth and classic with that distinctive Tennessee whiskey taste. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 168,
            carbs: 18.5,
            protein: 0,
            fat: 0,
            sugar: 17.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Whiskey', 'Cola', 'Jack Daniels', 'Premium']
    },

    // Cocktails with enhanced information
    'margarita': {
        name: 'Margarita',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '15-20%',
        standardDrinks: '1.5',
        ingredients: ['Tequila (2 oz)', 'Lime juice (1 oz)', 'Triple sec (1 oz)', 'Salt rim'],
        description: 'A refreshing cocktail made with tequila, lime juice, and triple sec, typically served with salt on the rim. One standard margarita contains 1.5 standard drinks.',
        nutrition: {
            calories: 168,
            carbs: 8.5,
            protein: 0.2,
            fat: 0,
            sugar: 6.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Citrus', 'Classic', 'Refreshing']
    },
    'mojito': {
        name: 'Mojito',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['White rum (2 oz)', 'Lime juice (1 oz)', 'Mint leaves', 'Sugar (1 tsp)', 'Soda water'],
        description: 'A traditional Cuban highball cocktail with white rum, sugar, lime juice, soda water, and mint. One standard mojito contains 1.2 standard drinks.',
        nutrition: {
            calories: 148,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Mint', 'Refreshing', 'Cuban']
    },
    'oldfashioned': {
        name: 'Old Fashioned',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Bourbon whiskey (2 oz)', 'Angostura bitters (2-3 dashes)', 'Sugar cube', 'Orange peel'],
        description: 'A classic whiskey cocktail with bourbon, bitters, sugar, and orange peel. One standard old fashioned contains 1.8 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 0.4,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Classic', 'Bourbon', 'Sophisticated']
    },
    'negroni': {
        name: 'Negroni',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.5',
        ingredients: ['Gin (1 oz)', 'Campari (1 oz)', 'Sweet vermouth (1 oz)', 'Orange peel'],
        description: 'An Italian cocktail with equal parts gin, Campari, and sweet vermouth. One standard negroni contains 1.5 standard drinks.',
        nutrition: {
            calories: 128,
            carbs: 0.2,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Italian', 'Bitter', 'Classic']
    },
    'manhattan': {
        name: 'Manhattan',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Rye whiskey (2 oz)', 'Sweet vermouth (1 oz)', 'Angostura bitters (2-3 dashes)', 'Cherry garnish'],
        description: 'A classic whiskey cocktail with rye, sweet vermouth, and bitters. One standard manhattan contains 1.8 standard drinks.',
        nutrition: {
            calories: 132,
            carbs: 0.3,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Classic', 'Rye', 'Sophisticated']
    },

    // Top 100 Cocktails (1-25)
    'daiquiri': {
        name: 'Daiquiri',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['White rum (2 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.75 oz)'],
        description: 'A classic Cuban cocktail with rum, lime juice, and simple syrup. One standard daiquiri contains 1.4 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 7.2,
            protein: 0.1,
            fat: 0,
            sugar: 6.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Classic', 'Cuban', 'Citrus']
    },
    'martini': {
        name: 'Martini',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Gin (2.5 oz)', 'Dry vermouth (0.5 oz)', 'Lemon twist or olive garnish'],
        description: 'The quintessential cocktail with gin and dry vermouth. One standard martini contains 1.8 standard drinks.',
        nutrition: {
            calories: 124,
            carbs: 0.2,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Sophisticated', 'Iconic']
    },
    'gin-and-tonic': {
        name: 'Gin & Tonic',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Tonic water (4-6 oz)', 'Lime wedge'],
        description: 'A refreshing highball cocktail with gin and tonic water. One standard gin & tonic contains 1.2 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 7.8,
            protein: 0,
            fat: 0,
            sugar: 7.1,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Refreshing', 'Highball', 'Classic']
    },
    'whiskey-sour': {
        name: 'Whiskey Sour',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Bourbon whiskey (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Egg white (optional)'],
        description: 'A classic sour cocktail with bourbon, lemon juice, and simple syrup. One standard whiskey sour contains 1.4 standard drinks.',
        nutrition: {
            calories: 158,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.5,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Sour', 'Classic', 'Bourbon']
    },
    'sidecar': {
        name: 'Sidecar',
        type: 'Cocktail',
        alcohol: 'Cognac',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Cognac (2 oz)', 'Cointreau (0.75 oz)', 'Lemon juice (0.75 oz)', 'Sugar rim'],
        description: 'A sophisticated cocktail with cognac, Cointreau, and lemon juice. One standard sidecar contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Cognac', 'Sophisticated', 'French', 'Citrus']
    },
    'gimlet': {
        name: 'Gimlet',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lime cordial (0.75 oz)', 'Lime wheel garnish'],
        description: 'A classic gin cocktail with lime cordial. One standard gimlet contains 1.6 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.5,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Lime', 'Refreshing']
    },
    'sazerac': {
        name: 'Sazerac',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Rye whiskey (2 oz)', 'Peychaud\'s bitters (3 dashes)', 'Absinthe rinse', 'Sugar cube', 'Lemon peel'],
        description: 'A New Orleans classic with rye whiskey, absinthe, and bitters. One standard sazerac contains 1.8 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 0.3,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'New Orleans', 'Classic', 'Absinthe']
    },
    'boulevardier': {
        name: 'Boulevardier',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Bourbon whiskey (1.5 oz)', 'Campari (1 oz)', 'Sweet vermouth (1 oz)', 'Orange peel'],
        description: 'A whiskey variation of the Negroni with bourbon instead of gin. One standard boulevardier contains 1.8 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 0.4,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Bourbon', 'Bitter', 'Sophisticated']
    },
    'aviation': {
        name: 'Aviation',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.75 oz)', 'Maraschino liqueur (0.5 oz)', 'Crème de violette (0.25 oz)'],
        description: 'A classic gin cocktail with a beautiful purple hue. One standard aviation contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Purple', 'Sophisticated']
    },
    'last-word': {
        name: 'Last Word',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (0.75 oz)', 'Green Chartreuse (0.75 oz)', 'Maraschino liqueur (0.75 oz)', 'Lime juice (0.75 oz)'],
        description: 'A complex gin cocktail with equal parts of four ingredients. One standard last word contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Complex', 'Equal Parts', 'Chartreuse']
    },
    'corpse-reviver-2': {
        name: 'Corpse Reviver No. 2',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (0.75 oz)', 'Cointreau (0.75 oz)', 'Lillet Blanc (0.75 oz)', 'Lemon juice (0.75 oz)', 'Absinthe rinse'],
        description: 'A classic equal-parts cocktail with a complex flavor profile. One standard corpse reviver contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Equal Parts', 'Complex', 'Classic']
    },
    'penicillin': {
        name: 'Penicillin',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Blended Scotch (2 oz)', 'Lemon juice (0.375 oz)', 'Honey syrup (0.375 oz)', 'Islay Scotch float (0.25 oz)', 'Ginger syrup (0.375 oz)'],
        description: 'A modern classic with Scotch, honey, ginger, and lemon. One standard penicillin contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Modern', 'Ginger']
    },
    'paper-plane': {
        name: 'Paper Plane',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Bourbon (0.75 oz)', 'Aperol (0.75 oz)', 'Amaro Nonino (0.75 oz)', 'Lemon juice (0.75 oz)'],
        description: 'A modern equal-parts cocktail with bourbon and Italian amari. One standard paper plane contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Modern', 'Equal Parts', 'Amari']
    },
    'naked-and-famous': {
        name: 'Naked & Famous',
        type: 'Cocktail',
        alcohol: 'Mezcal',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Mezcal (0.75 oz)', 'Yellow Chartreuse (0.75 oz)', 'Aperol (0.75 oz)', 'Lime juice (0.75 oz)'],
        description: 'A modern equal-parts cocktail with mezcal and herbal liqueurs. One standard naked & famous contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Mezcal', 'Modern', 'Equal Parts', 'Herbal']
    },
    'jungle-bird': {
        name: 'Jungle Bird',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (1.5 oz)', 'Pineapple juice (1.5 oz)', 'Campari (0.75 oz)', 'Lime juice (0.5 oz)', 'Simple syrup (0.5 oz)'],
        description: 'A tropical cocktail with dark rum, pineapple, and Campari. One standard jungle bird contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Campari']
    },
    'painkiller': {
        name: 'Painkiller',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (2 oz)', 'Pineapple juice (4 oz)', 'Orange juice (1 oz)', 'Cream of coconut (1 oz)', 'Nutmeg garnish'],
        description: 'A tropical cocktail with rum, pineapple, orange, and coconut. One standard painkiller contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Coconut']
    },
    'pina-colada': {
        name: 'Piña Colada',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['White rum (2 oz)', 'Pineapple juice (2 oz)', 'Cream of coconut (2 oz)', 'Pineapple wedge garnish'],
        description: 'The national drink of Puerto Rico with rum, pineapple, and coconut. One standard piña colada contains 1.2 standard drinks.',
        nutrition: {
            calories: 245,
            carbs: 18.5,
            protein: 0.3,
            fat: 0,
            sugar: 16.2,
            servingSize: '5 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Coconut']
    },
    'mai-tai': {
        name: 'Mai Tai',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Aged rum (2 oz)', 'Orange curaçao (0.75 oz)', 'Orgeat (0.75 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.25 oz)'],
        description: 'A classic tiki cocktail with aged rum and tropical flavors. One standard mai tai contains 1.4 standard drinks.',
        nutrition: {
            calories: 198,
            carbs: 12.5,
            protein: 0.2,
            fat: 0,
            sugar: 11.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tiki', 'Tropical', 'Classic']
    },
    'zombie': {
        name: 'Zombie',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Multiple rums (3 oz total)', 'Falernum (0.5 oz)', 'Donn\'s mix (1 oz)', 'Grenadine (0.25 oz)', 'Angostura bitters (1 dash)'],
        description: 'A complex tiki cocktail with multiple rums and tropical ingredients. One standard zombie contains 1.6 standard drinks.',
        nutrition: {
            calories: 285,
            carbs: 18.2,
            protein: 0.3,
            fat: 0,
            sugar: 16.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tiki', 'Complex', 'Tropical']
    },
    'dark-n-stormy': {
        name: 'Dark \'n\' Stormy',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (2 oz)', 'Ginger beer (4 oz)', 'Lime wedge'],
        description: 'A refreshing highball with dark rum and ginger beer. One standard dark \'n\' stormy contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Highball', 'Ginger', 'Refreshing']
    },
    'moscow-mule': {
        name: 'Moscow Mule',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Ginger beer (4 oz)', 'Lime juice (0.5 oz)', 'Lime wedge'],
        description: 'A refreshing highball with vodka and ginger beer. One standard moscow mule contains 1.2 standard drinks.',
        nutrition: {
            calories: 156,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Highball', 'Ginger', 'Refreshing']
    },
    'caipirinha': {
        name: 'Caipirinha',
        type: 'Cocktail',
        alcohol: 'Cachaça',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Cachaça (2 oz)', 'Lime (1 whole)', 'Sugar (2 tsp)', 'Muddled lime and sugar'],
        description: 'Brazil\'s national cocktail with cachaça, lime, and sugar. One standard caipirinha contains 1.4 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Cachaça', 'Brazilian', 'Lime', 'Muddled']
    },
    'paloma': {
        name: 'Paloma',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Tequila blanco (2 oz)', 'Grapefruit soda (4 oz)', 'Lime juice (0.5 oz)', 'Salt rim (optional)'],
        description: 'A refreshing Mexican cocktail with tequila and grapefruit. One standard paloma contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 12.8,
            protein: 0.2,
            fat: 0,
            sugar: 11.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Mexican', 'Grapefruit', 'Refreshing']
    },
    'el-diablo': {
        name: 'El Diablo',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Tequila reposado (2 oz)', 'Crème de cassis (0.5 oz)', 'Lime juice (0.75 oz)', 'Ginger beer (4 oz)'],
        description: 'A tequila cocktail with blackcurrant liqueur and ginger beer. One standard el diablo contains 1.2 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 10.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.8,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Ginger', 'Blackcurrant', 'Refreshing']
    },
    'bloody-mary': {
        name: 'Bloody Mary',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Tomato juice (4 oz)', 'Lemon juice (0.5 oz)', 'Worcestershire sauce', 'Hot sauce', 'Celery salt'],
        description: 'A savory cocktail with vodka and tomato juice. One standard bloody mary contains 1.2 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 8.2,
            protein: 1.8,
            fat: 0,
            sugar: 6.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Savory', 'Tomato', 'Brunch']
    },

    // Top 100 Cocktails (26-50)
    'cosmopolitan': {
        name: 'Cosmopolitan',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (1.5 oz)', 'Cointreau (0.5 oz)', 'Cranberry juice (0.5 oz)', 'Lime juice (0.5 oz)', 'Orange peel garnish'],
        description: 'A sophisticated vodka cocktail with cranberry and citrus. One standard cosmopolitan contains 1.4 standard drinks.',
        nutrition: {
            calories: 172,
            carbs: 9.5,
            protein: 0.2,
            fat: 0,
            sugar: 8.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Sophisticated', 'Cranberry', 'Citrus']
    },
    'espresso-martini': {
        name: 'Espresso Martini',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (0.5 oz)', 'Espresso (1 oz)', 'Simple syrup (0.5 oz)', 'Coffee beans garnish'],
        description: 'A coffee-flavored vodka cocktail with espresso. One standard espresso martini contains 1.6 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 8.8,
            protein: 0.1,
            fat: 0,
            sugar: 7.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Coffee', 'Modern', 'Sophisticated']
    },
    'white-russian': {
        name: 'White Russian',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (1 oz)', 'Heavy cream (1 oz)'],
        description: 'A creamy cocktail with vodka, coffee liqueur, and cream. One standard white russian contains 1.4 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 8.5,
            protein: 0.8,
            fat: 11.2,
            sugar: 7.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Creamy', 'Coffee', 'Dessert']
    },
    'black-russian': {
        name: 'Black Russian',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (1 oz)'],
        description: 'A simple cocktail with vodka and coffee liqueur. One standard black russian contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 6.8,
            protein: 0,
            fat: 0,
            sugar: 5.2,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Coffee', 'Strong']
    },
    'screwdriver': {
        name: 'Screwdriver',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Orange juice (4 oz)', 'Orange slice garnish'],
        description: 'A simple highball with vodka and orange juice. One standard screwdriver contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 12.5,
            protein: 0.8,
            fat: 0,
            sugar: 10.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Orange', 'Highball']
    },
    'bay-breeze': {
        name: 'Bay Breeze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Cranberry juice (2 oz)', 'Pineapple juice (2 oz)'],
        description: 'A refreshing cocktail with vodka, cranberry, and pineapple. One standard bay breeze contains 1.2 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 15.8,
            protein: 0.5,
            fat: 0,
            sugar: 14.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Refreshing', 'Tropical', 'Fruity']
    },
    'sea-breeze': {
        name: 'Sea Breeze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Cranberry juice (3 oz)', 'Grapefruit juice (1 oz)', 'Lime wedge'],
        description: 'A refreshing cocktail with vodka, cranberry, and grapefruit. One standard sea breeze contains 1.2 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 14.2,
            protein: 0.4,
            fat: 0,
            sugar: 12.8,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Refreshing', 'Grapefruit', 'Citrus']
    },
    'kamikaze': {
        name: 'Kamikaze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (1 oz)', 'Triple sec (1 oz)', 'Lime juice (1 oz)', 'Lime wedge garnish'],
        description: 'A citrusy cocktail with vodka, triple sec, and lime. One standard kamikaze contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Citrus', 'Equal Parts', 'Strong']
    },
    'lemon-drop': {
        name: 'Lemon Drop',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Triple sec (0.5 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.5 oz)', 'Sugar rim'],
        description: 'A sweet and sour vodka cocktail with lemon. One standard lemon drop contains 1.6 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 9.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.5,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Sweet', 'Lemon', 'Sour']
    },
    'blue-lagoon': {
        name: 'Blue Lagoon',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (2 oz)', 'Blue curaçao (1 oz)', 'Lemonade (2 oz)', 'Cherry garnish'],
        description: 'A blue-colored cocktail with vodka and blue curaçao. One standard blue lagoon contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Blue', 'Tropical', 'Sweet']
    },
    'sex-on-the-beach': {
        name: 'Sex on the Beach',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Peach schnapps (0.5 oz)', 'Cranberry juice (2 oz)', 'Orange juice (2 oz)'],
        description: 'A fruity cocktail with vodka, peach schnapps, and fruit juices. One standard sex on the beach contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Fruity', 'Peach', 'Tropical']
    },
    'woo-woo': {
        name: 'Woo Woo',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Peach schnapps (0.5 oz)', 'Cranberry juice (3 oz)', 'Lime wedge'],
        description: 'A simple cocktail with vodka, peach schnapps, and cranberry. One standard woo woo contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Peach', 'Cranberry']
    },
    'harvey-wallbanger': {
        name: 'Harvey Wallbanger',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Orange juice (4 oz)', 'Galliano (0.5 oz float)', 'Orange slice'],
        description: 'A highball with vodka, orange juice, and Galliano float. One standard harvey wallbanger contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Highball', 'Orange', 'Galliano']
    },
    'french-75': {
        name: 'French 75',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Gin (1 oz)', 'Lemon juice (0.5 oz)', 'Simple syrup (0.5 oz)', 'Champagne (2 oz)', 'Lemon twist'],
        description: 'A champagne cocktail with gin, lemon, and simple syrup. One standard french 75 contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Champagne', 'Sophisticated', 'Classic']
    },
    'ramos-gin-fizz': {
        name: 'Ramos Gin Fizz',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.5 oz)', 'Lime juice (0.5 oz)', 'Simple syrup (1 oz)', 'Egg white', 'Heavy cream (1 oz)', 'Orange flower water (3 drops)', 'Soda water'],
        description: 'A complex gin cocktail with egg white and cream. One standard ramos gin fizz contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Complex', 'Egg White', 'Creamy']
    },
    'bee\'s-knees': {
        name: 'Bee\'s Knees',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.75 oz)', 'Honey syrup (0.75 oz)', 'Lemon twist'],
        description: 'A gin cocktail with lemon juice and honey syrup. One standard bee\'s knees contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Honey', 'Lemon', 'Classic']
    },
    'south-side': {
        name: 'South Side',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.75 oz)', 'Mint leaves (6-8)', 'Mint sprig garnish'],
        description: 'A gin cocktail with lime, simple syrup, and mint. One standard south side contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Mint', 'Lime', 'Refreshing']
    },
    'tom-collins': {
        name: 'Tom Collins',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Soda water (3 oz)', 'Lemon wheel and cherry'],
        description: 'A refreshing highball with gin, lemon, and soda water. One standard tom collins contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Highball', 'Refreshing', 'Classic']
    },
    'john-collins': {
        name: 'John Collins',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Bourbon whiskey (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Soda water (3 oz)', 'Lemon wheel and cherry'],
        description: 'A whiskey variation of the Tom Collins. One standard john collins contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Highball', 'Refreshing', 'Bourbon']
    },
    'mint-julep': {
        name: 'Mint Julep',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Bourbon whiskey (2.5 oz)', 'Simple syrup (0.5 oz)', 'Mint leaves (8-10)', 'Crushed ice', 'Mint sprig garnish'],
        description: 'A classic Kentucky cocktail with bourbon and mint. One standard mint julep contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Mint', 'Kentucky', 'Classic']
    },
    'hot-toddy': {
        name: 'Hot Toddy',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Whiskey (2 oz)', 'Hot water (4 oz)', 'Honey (1 tsp)', 'Lemon juice (0.5 oz)', 'Lemon wheel', 'Cinnamon stick'],
        description: 'A warm cocktail with whiskey, hot water, and honey. One standard hot toddy contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Hot', 'Honey', 'Warming']
    },
    'irish-coffee': {
        name: 'Irish Coffee',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Irish whiskey (1.5 oz)', 'Hot coffee (4 oz)', 'Brown sugar (1 tsp)', 'Whipped cream'],
        description: 'A warm cocktail with Irish whiskey and coffee. One standard irish coffee contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Hot', 'Coffee', 'Irish']
    },
    'rusty-nail': {
        name: 'Rusty Nail',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Drambuie (0.5 oz)', 'Lemon twist'],
        description: 'A simple cocktail with Scotch and Drambuie. One standard rusty nail contains 1.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Simple', 'Strong']
    },
    'godfather': {
        name: 'Godfather',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Amaretto (0.5 oz)', 'Orange peel'],
        description: 'A simple cocktail with Scotch and Amaretto. One standard godfather contains 1.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Simple', 'Amaretto']
    },
    'rob-roy': {
        name: 'Rob Roy',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Sweet vermouth (0.75 oz)', 'Angostura bitters (2 dashes)', 'Cherry garnish'],
        description: 'A Scotch variation of the Manhattan. One standard rob roy contains 1.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Classic', 'Manhattan Variation']
    },
    'blood-and-sand': {
        name: 'Blood and Sand',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Scotch whisky (0.75 oz)', 'Sweet vermouth (0.75 oz)', 'Cherry liqueur (0.75 oz)', 'Orange juice (0.75 oz)', 'Orange peel'],
        description: 'An equal-parts cocktail with Scotch and fruit juices. One standard blood and sand contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Equal Parts', 'Fruity']
    },

    // Wines with enhanced information
    'chardonnay': {
        name: 'Chardonnay',
        type: 'Wine',
        alcohol: 'White Wine',
        abv: '13-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Chardonnay grapes'],
        description: 'A green-skinned grape variety used in white wine production, originating in Burgundy, France. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'White', 'French', 'Elegant', 'Versatile']
    },
    'cabernetSauvignon': {
        name: 'Cabernet Sauvignon',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '13.5-15%',
        standardDrinks: '1.5',
        ingredients: ['Cabernet Sauvignon grapes'],
        description: 'A full-bodied red wine with dark fruit, tannins, and aging potential. One 175ml glass contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Full-bodied', 'Tannic', 'Classic']
    },
    'pinotNoir': {
        name: 'Pinot Noir',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '12.5-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Pinot Noir grapes'],
        description: 'A light to medium-bodied red wine with red fruit and earthy notes. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Light-bodied', 'Elegant', 'Versatile']
    },
    'sauvignonBlanc': {
        name: 'Sauvignon Blanc',
        type: 'Wine',
        alcohol: 'White Wine',
        abv: '12-14%',
        standardDrinks: '1.3',
        ingredients: ['Sauvignon Blanc grapes'],
        description: 'A crisp white wine with citrus, herbaceous, and tropical fruit notes. One 175ml glass contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'White', 'Crisp', 'Citrus', 'Refreshing']
    },
    'merlot': {
        name: 'Merlot',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '13-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Merlot grapes'],
        description: 'A medium to full-bodied red wine with soft tannins and plum flavors. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Medium-bodied', 'Soft', 'Approachable']
    },

    // Spirits with enhanced information
    'whiskey': {
        name: 'Whiskey',
        type: 'Spirit',
        alcohol: 'Whiskey',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Grain mash', 'Water', 'Yeast', 'Oak barrel aged'],
        description: 'A distilled alcoholic beverage made from fermented grain mash, typically aged in wooden casks. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Aged', 'Classic', 'Premium', 'Versatile']
    },
    'vodka': {
        name: 'Vodka',
        type: 'Spirit',
        alcohol: 'Vodka',
        abv: '40%',
        standardDrinks: '1.4',
        ingredients: ['Grain or potato mash', 'Water', 'Yeast'],
        description: 'A clear distilled spirit with neutral flavor, perfect for mixing in cocktails. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Neutral', 'Versatile', 'Mixable', 'Clean']
    },
    'gin': {
        name: 'Gin',
        type: 'Spirit',
        alcohol: 'Gin',
        abv: '40-47%',
        standardDrinks: '1.4',
        ingredients: ['Grain spirit', 'Juniper berries', 'Botanicals', 'Water'],
        description: 'A distilled spirit flavored with juniper berries and other botanicals. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Botanical', 'Juniper', 'Classic', 'Versatile']
    },
    'rum': {
        name: 'Rum',
        type: 'Spirit',
        alcohol: 'Rum',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Sugarcane juice or molasses', 'Water', 'Yeast', 'Oak barrel aged'],
        description: 'A distilled spirit made from sugarcane byproducts, often aged in oak barrels. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Sugarcane', 'Caribbean', 'Versatile', 'Aged']
    },
    'tequila': {
        name: 'Tequila',
        type: 'Spirit',
        alcohol: 'Tequila',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Blue agave', 'Water', 'Yeast', 'Oak barrel aged (reposado/anejo)'],
        description: 'A distilled spirit made from blue agave, primarily produced in Mexico. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Agave', 'Mexican', 'Premium', 'Versatile']
    }
};

// Tab switching functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
        
        // Clear previous results
        clearResults();
    });
});

// Name input functionality
let searchTimeout;

beverageNameInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        showSuggestions(query);
    }, 300);
});

beverageNameInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length >= 2) {
        showSuggestions(query);
    } else {
        hideSuggestions();
    }
});

beverageNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBeverage();
    }
});

searchBtn.addEventListener('click', searchBeverage);

function showSuggestions(query) {
    const matches = Object.keys(beverageDatabase).filter(beverage => {
        const data = beverageDatabase[beverage];
        return beverage.includes(query) || 
               data.name.toLowerCase().includes(query) ||
               data.type.toLowerCase().includes(query);
    });
    
    if (matches.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestions.innerHTML = matches.slice(0, 8).map(beverage => {
        const data = beverageDatabase[beverage];
        return `<div class="suggestion-item" onclick="selectSuggestion('${beverage}')">
            <strong>${data.name}</strong> - ${data.type} (${data.abv || 'N/A'})
        </div>`;
    }).join('');
    
    suggestions.style.display = 'block';
}

function hideSuggestions() {
    suggestions.style.display = 'none';
}

function selectSuggestion(beverageKey) {
    beverageNameInput.value = beverageDatabase[beverageKey].name;
    hideSuggestions();
    searchBeverage();
}

function searchBeverage() {
    const query = beverageNameInput.value.toLowerCase().trim();
    hideSuggestions();
    
    if (!query) {
        showError('Please enter a beverage name');
        return;
    }
    
    // Find matching beverage - more flexible search
    const beverageKey = Object.keys(beverageDatabase).find(key => {
        const beverage = beverageDatabase[key];
        return key === query || 
               beverage.name.toLowerCase() === query ||
               beverage.name.toLowerCase().includes(query) ||
               key.includes(query);
    });
    
    if (beverageKey) {
        displayBeverageInfo(beverageDatabase[beverageKey]);
    } else {
        // Show suggestions for similar beverages
        const similarBeverages = Object.keys(beverageDatabase).filter(key => {
            const beverage = beverageDatabase[key];
            return beverage.name.toLowerCase().includes(query) || key.includes(query);
        }).slice(0, 3);
        
        if (similarBeverages.length > 0) {
            const suggestions = similarBeverages.map(key => beverageDatabase[key].name).join(', ');
            showError(`Beverage not found. Did you mean: ${suggestions}?`);
        } else {
            showError('Beverage not found. Try searching for Australian beers like "Swan Draught", "Victoria Bitter", "Coopers Pale Ale", or cocktails like "Margarita", "Martini"');
        }
    }
}

// Photo upload functionality
uploadArea.addEventListener('click', () => {
    photoInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

photoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

removeBtn.addEventListener('click', () => {
    clearPhotoUpload();
});

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Image size should be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        
        // Simulate image recognition (in a real app, this would call an AI service)
        setTimeout(() => {
            simulateImageRecognition();
        }, 1500);
    };
    reader.readAsDataURL(file);
}

function clearPhotoUpload() {
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    previewImage.src = '';
    photoInput.value = '';
    clearResults();
}

function simulateImageRecognition() {
    // Simulate AI recognition with loading state
    const loadingText = document.createElement('div');
    loadingText.innerHTML = '<div class="loading"></div> Analyzing image...';
    loadingText.style.textAlign = 'center';
    loadingText.style.padding = '20px';
    loadingText.style.color = '#666';
    
    beverageCard.innerHTML = '';
    beverageCard.appendChild(loadingText);
    resultsSection.style.display = 'block';
    
    // Simulate API delay and show a random beverage result
    setTimeout(() => {
        const beverages = Object.values(beverageDatabase);
        const randomBeverage = beverages[Math.floor(Math.random() * beverages.length)];
        displayBeverageInfo(randomBeverage, true);
    }, 2000);
}

// Display results
function displayBeverageInfo(beverage, fromImage = false) {
    const sourceText = fromImage ? ' (Identified from image)' : '';
    
    // Create nutrition section if available
    const nutritionSection = beverage.nutrition ? `
        <div class="nutrition-section">
            <h4>Nutritional Information (per ${beverage.nutrition.servingSize})</h4>
            <div class="nutrition-grid">
                <div class="nutrition-item">
                    <span class="nutrition-label">Calories</span>
                    <span class="nutrition-value">${beverage.nutrition.calories}</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Carbs</span>
                    <span class="nutrition-value">${beverage.nutrition.carbs}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Protein</span>
                    <span class="nutrition-value">${beverage.nutrition.protein}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Fat</span>
                    <span class="nutrition-value">${beverage.nutrition.fat}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="nutrition-label">Sugar</span>
                    <span class="nutrition-value">${beverage.nutrition.sugar}g</span>
                </div>
            </div>
        </div>
    ` : '';
    
    beverageCard.innerHTML = `
        <div class="beverage-info">
            <img src="${beverage.image}" alt="${beverage.name}" class="beverage-image">
            <div class="beverage-details">
                <h3>${beverage.name}${sourceText}</h3>
                <p><strong>Type:</strong> ${beverage.type}</p>
                <p><strong>Alcohol:</strong> ${beverage.alcohol}</p>
                ${beverage.abv ? `<p><strong>ABV:</strong> ${beverage.abv}</p>` : ''}
                ${beverage.standardDrinks ? `<p><strong>Standard Drinks:</strong> ${beverage.standardDrinks}</p>` : ''}
                <p><strong>Ingredients:</strong> ${beverage.ingredients.join(', ')}</p>
                <p><strong>Description:</strong> ${beverage.description}</p>
                ${nutritionSection}
                <div class="beverage-tags">
                    ${beverage.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function clearResults() {
    resultsSection.style.display = 'none';
    beverageCard.innerHTML = '';
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.marginTop = '10px';
    errorDiv.style.padding = '10px';
    errorDiv.style.backgroundColor = '#fff8f8';
    errorDiv.style.border = '1px solid #dc3545';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.color = '#dc3545';
    
    // Insert after the input
    const inputGroup = beverageNameInput.closest('.input-group');
    inputGroup.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-wrapper') && !e.target.closest('.suggestions')) {
        hideSuggestions();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('BevyFinder initialized!');
    console.log('Available beverages:', Object.keys(beverageDatabase));
}); 
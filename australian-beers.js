// Australian Beer Database - Popular brands available at Dan Murphy's and Australian retailers
const australianBeerDatabase = {
    // Major Australian Breweries
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
    'x-gold': {
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
    'cascade-premium': {
        name: 'Cascade Premium Lager',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A premium Tasmanian lager with a clean, refreshing taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Tasmanian']
    },
    'coopers-pale-ale': {
        name: 'Coopers Pale Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A naturally cloudy pale ale with distinctive fruity characters. One 375ml bottle contains 1.1 standard drinks.',
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
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sparkling Ale', 'Australian', 'Traditional', 'Sediment']
    },
    'coopers-stout': {
        name: 'Coopers Best Extra Stout',
        type: 'Beer',
        alcohol: 'Irish Stout',
        abv: '6.3%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A rich, full-bodied stout with coffee and chocolate notes. One 375ml bottle contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Rich', 'Coffee']
    },
    'little-creatures-pale-ale': {
        name: 'Little Creatures Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A hoppy American-style pale ale with citrus and floral notes. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Hoppy', 'Citrus']
    },
    'little-creatures-bright-ale': {
        name: 'Little Creatures Bright Ale',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bright, refreshing golden ale with subtle hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Bright', 'Refreshing']
    },
    'stone-wood-pacific-ale': {
        name: 'Stone & Wood Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical fruit-forward pale ale with Galaxy hops. One 330ml bottle contains 1.0 standard drink.',
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
    '4-pines-pale-ale': {
        name: '4 Pines Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.1%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A balanced pale ale with citrus and pine hop notes. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Balanced', 'Citrus']
    },
    '4-pines-hefeweizen': {
        name: '4 Pines Hefeweizen',
        type: 'Beer',
        alcohol: 'German Hefeweizen',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Wheat malt', 'Barley malt', 'Hallertau hops', 'Hefeweizen yeast'],
        description: 'A traditional German-style hefeweizen with banana and clove notes. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'Australian', 'German-style', 'Banana']
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
    'young-henrys-real-ale': {
        name: 'Young Henrys Real Ale',
        type: 'Beer',
        alcohol: 'English Bitter',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Fuggles hops', 'Water', 'Yeast'],
        description: 'A traditional English-style bitter with earthy hop character. One 330ml bottle contains 1.0 standard drink.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'English-style', 'Earthy']
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
    'modus-operandi-sonic-prayer': {
        name: 'Modus Operandi Sonic Prayer',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '10.0%',
        standardDrinks: '2.4',
        ingredients: ['Chocolate malt', 'Coffee', 'Vanilla', 'Water', 'Yeast'],
        description: 'A rich imperial stout with coffee and vanilla notes. One 330ml can contains 2.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Imperial', 'Coffee']
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
    'hop-nation-zen-state': {
        name: 'Hop Nation Zen State',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A refreshing golden ale with subtle hop character. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Refreshing', 'Subtle']
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
        description: 'A mango-infused IPA with intense tropical fruit character. One 330ml can contains 1.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Mango', 'Tropical']
    },
    'tuatara-aroha': {
        name: 'Tuatara Aroha',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth golden ale with balanced malt and hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'New Zealand', 'Smooth', 'Balanced']
    },
    'tuatara-apa': {
        name: 'Tuatara APA',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'New Zealand', 'Classic', 'Citrus']
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
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A double IPA with massive hop character and high alcohol content. One 330ml bottle contains 2.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Double', 'High ABV']
    },
    '8-wired-hopwired': {
        name: '8 Wired Hopwired',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '7.3%',
        standardDrinks: '1.8',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and citrus hop character. One 330ml bottle contains 1.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'Tropical']
    },
    '8-wired-rewired': {
        name: '8 Wired Rewired',
        type: 'Beer',
        alcohol: 'Brown Ale',
        abv: '5.3%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Chocolate malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich brown ale with chocolate and caramel notes. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Brown Ale', 'New Zealand', 'Rich', 'Chocolate']
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
        ingredients: ['Malted barley', 'Chocolate malt', 'Coffee', 'Water', 'Yeast'],
        description: 'A rich porter with coffee and chocolate notes. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'New Zealand', 'Rich', 'Coffee']
    },
    'parrot-dog-bitter-bitch': {
        name: 'ParrotDog Bitter Bitch',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and bitterness. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'Bitter']
    },
    'parrot-dog-flaxen-feather': {
        name: 'ParrotDog Flaxen Feather',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth golden ale with balanced malt and hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'New Zealand', 'Smooth', 'Balanced']
    },
    'emerson-pilsner': {
        name: 'Emerson\'s Pilsner',
        type: 'Beer',
        alcohol: 'Czech Pilsner',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Pilsner malt', 'Saaz hops', 'Water', 'Lager yeast'],
        description: 'A classic Czech-style pilsner with noble hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'New Zealand', 'Czech-style', 'Noble Hops']
    },
    'emerson-bookbinder': {
        name: 'Emerson\'s Bookbinder',
        type: 'Beer',
        alcohol: 'English Bitter',
        abv: '3.7%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Fuggles hops', 'Water', 'Yeast'],
        description: 'A traditional English-style bitter with earthy hop character. One 330ml bottle contains 0.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'New Zealand', 'English-style', 'Earthy']
    },
    'mata-artesian': {
        name: 'Mata Artesian',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A refreshing golden ale with clean, crisp character. One 330ml bottle contains 1.0 standard drink.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'New Zealand', 'Refreshing', 'Clean']
    },
    'mata-hop-head': {
        name: 'Mata Hop Head',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and citrus hop character. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'Tropical']
    },
    'liberty-citra': {
        name: 'Liberty Citra',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Citra hops', 'Water', 'Yeast'],
        description: 'A single-hop pale ale showcasing Citra hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'New Zealand', 'Single-hop', 'Citra']
    },
    'liberty-prohibition': {
        name: 'Liberty Prohibition',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American pale ale with Cascade hop character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'New Zealand', 'Classic', 'Cascade']
    },
    'hallertau-maximus': {
        name: 'Hallertau Maximus',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '7.0%',
        standardDrinks: '1.7',
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and high alcohol content. One 330ml bottle contains 1.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'High ABV']
    },
    'hallertau-luxury-bru': {
        name: 'Hallertau Luxury Bru',
        type: 'Beer',
        alcohol: 'Pilsner',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Pilsner malt', 'Saaz hops', 'Water', 'Lager yeast'],
        description: 'A premium pilsner with noble hop character and crisp finish. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'New Zealand', 'Premium', 'Crisp']
    },
    'three-boys-wheat': {
        name: 'Three Boys Wheat',
        type: 'Beer',
        alcohol: 'German Hefeweizen',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Wheat malt', 'Barley malt', 'Hallertau hops', 'Hefeweizen yeast'],
        description: 'A traditional German-style hefeweizen with banana and clove notes. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'New Zealand', 'German-style', 'Banana']
    },
    'three-boys-pilsner': {
        name: 'Three Boys Pilsner',
        type: 'Beer',
        alcohol: 'Czech Pilsner',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Pilsner malt', 'Saaz hops', 'Water', 'Lager yeast'],
        description: 'A classic Czech-style pilsner with noble hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'New Zealand', 'Czech-style', 'Noble Hops']
    },
    'mike\'s-organic-ipa': {
        name: 'Mike\'s Organic IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Organic malted barley', 'Organic hops', 'Water', 'Yeast'],
        description: 'An organic IPA with balanced hop and malt character. One 330ml bottle contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Organic', 'Balanced']
    },
    'mike\'s-organic-lager': {
        name: 'Mike\'s Organic Lager',
        type: 'Beer',
        alcohol: 'Czech Pilsner',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Organic pilsner malt', 'Organic Saaz hops', 'Water', 'Lager yeast'],
        description: 'An organic Czech-style pilsner with noble hop character. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'New Zealand', 'Organic', 'Noble Hops']
    }
};

// Export the database for use in the main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = australianBeerDatabase;
} 
# BevyFinder

A modern, responsive web application that allows users to input alcoholic beverages either by name or by uploading a photo. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 🍷 Name Input
- **Smart Search**: Type to search for beverages with real-time suggestions
- **Auto-complete**: Get instant suggestions as you type
- **Comprehensive Database**: Includes top 100 rated beers, popular cocktails, wines, and spirits
- **Detailed Information**: View ingredients, descriptions, alcohol percentages, and standard drink counts

### 📸 Photo Upload
- **Drag & Drop**: Simply drag and drop images onto the upload area
- **Click to Browse**: Traditional file browser option
- **Image Preview**: See your uploaded image before processing
- **File Validation**: Supports common image formats with size limits
- **Simulated AI Recognition**: Demonstrates how image recognition would work (currently shows random results)

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and hover effects
- **Tab Interface**: Easy switching between name and photo input methods
- **Loading States**: Visual feedback during processing
- **Error Handling**: Clear error messages for invalid inputs

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The application will load with a beautiful gradient background

### Using Name Input
1. Click on the "Name Input" tab (default)
2. Start typing a beverage name (e.g., "margarita", "guinness")
3. Select from the dropdown suggestions or press Enter
4. View detailed information about the beverage

### Using Photo Upload
1. Click on the "Photo Upload" tab
2. Either:
   - Drag and drop an image file onto the upload area
   - Click "Choose File" to browse your computer
3. Wait for the image to be processed (simulated)
4. View the identified beverage information

## Available Beverages

The application includes a comprehensive database with over 200 beverages:

### 🍺 Top Rated Beers (50+ entries)
- **Westvleteren 12** - World's best beer (Quadrupel, 10.2% ABV)
- **Pliny the Younger** - Triple IPA (10.25% ABV)
- **Heady Topper** - Double IPA (8.0% ABV)
- **Kentucky Breakfast Stout** - Imperial Stout (12.0% ABV)
- **Dark Lord** - Imperial Stout (15.0% ABV)
- **Guinness Draught** - Irish Stout (4.2% ABV)
- **Duvel** - Belgian Strong Golden Ale (8.5% ABV)
- **Chimay Blue** - Trappist Strong Dark Ale (9.0% ABV)
- **Victoria Bitter (VB)** - Australia's most popular beer (4.9% ABV)
- **Coopers Pale Ale** - Classic Australian pale ale (4.5% ABV)
- **Stone & Wood Pacific Ale** - Tropical pale ale (4.4% ABV)
- **Balter XPA** - Sessionable extra pale ale (4.5% ABV)
- **Little Creatures Pale Ale** - Hoppy American-style pale ale (5.2% ABV)
- **Epic Armageddon** - Bold New Zealand IPA (6.66% ABV)
- **Yeastie Boys Gunnamatta** - Earl Grey tea-infused IPA (6.5% ABV)
- And many more...

### 🍸 Top 100 Cocktails
- **Margarita** - Tequila cocktail (15-20% ABV)
- **Martini** - Gin cocktail (25-30% ABV)
- **Daiquiri** - Rum cocktail (15-20% ABV)
- **Cosmopolitan** - Vodka cocktail (15-20% ABV)
- **Old Fashioned** - Whiskey cocktail (25-30% ABV)
- **Negroni** - Gin cocktail (20-25% ABV)
- **Manhattan** - Whiskey cocktail (25-30% ABV)
- **Mojito** - Rum cocktail (12-15% ABV)
- **Gin & Tonic** - Gin highball (8-12% ABV)
- **Whiskey Sour** - Whiskey sour (15-20% ABV)
- **Sidecar** - Cognac cocktail (20-25% ABV)
- **Sazerac** - New Orleans classic (25-30% ABV)
- **Boulevardier** - Whiskey Negroni (25-30% ABV)
- **Aviation** - Purple gin cocktail (20-25% ABV)
- **Last Word** - Equal parts gin cocktail (20-25% ABV)
- **Espresso Martini** - Coffee vodka cocktail (20-25% ABV)
- **White Russian** - Creamy vodka cocktail (15-20% ABV)
- **Piña Colada** - Tropical rum cocktail (12-15% ABV)
- **Mai Tai** - Classic tiki cocktail (15-20% ABV)
- **Bloody Mary** - Savory vodka cocktail (8-12% ABV)
- And many more...

### 🍷 Wines
- **Chardonnay** - White wine (13-14.5% ABV)
- **Cabernet Sauvignon** - Red wine (13.5-15% ABV)
- **Pinot Noir** - Red wine (12.5-14.5% ABV)
- **Sauvignon Blanc** - White wine (12-14% ABV)
- **Merlot** - Red wine (13-14.5% ABV)

### 🇦🇺 Top 50 Australian Beers
- **Carlton Draught** - Lager (4.6% ABV)
- **Victoria Bitter (VB)** - Lager (4.9% ABV)
- **Coopers Pale Ale** - Pale Ale (4.5% ABV)
- **Coopers Sparkling Ale** - Pale Ale (5.8% ABV)
- **Coopers Best Extra Stout** - Stout (6.3% ABV)
- **Stone & Wood Pacific Ale** - Australian Pale Ale (4.4% ABV)
- **Stone & Wood Green Coast Lager** - Lager (4.4% ABV)
- **Balter XPA** - Extra Pale Ale (4.2% ABV)
- **Balter IPA** - India Pale Ale (6.2% ABV)
- **Young Henrys Newtowner** - Australian Pale Ale (4.8% ABV)
- **Young Henrys Natural Lager** - Lager (4.2% ABV)
- **Modus Operandi Former Tenant** - India Pale Ale (6.5% ABV)
- **Modus Operandi Silent Knight** - Stout (5.0% ABV)
- **Hop Nation Rattenhund** - India Pale Ale (6.0% ABV)
- **Hop Nation The Wolf** - Double IPA (8.0% ABV)
- **Little Creatures Pale Ale** - American Pale Ale (5.2% ABV)
- **Little Creatures Bright Ale** - Golden Ale (4.5% ABV)
- **Little Creatures Dog Days** - Session IPA (4.4% ABV)
- **Mountain Goat Steam Ale** - California Common (4.5% ABV)
- **Mountain Goat Hightail Ale** - English Pale Ale (4.5% ABV)
- **Mountain Goat Fancy Pants** - Golden Ale (4.2% ABV)
- **4 Pines Pale Ale** - American Pale Ale (5.1% ABV)
- **4 Pines Kölsch** - Kölsch (4.6% ABV)
- **4 Pines Hefeweizen** - Hefeweizen (5.0% ABV)
- **Bridge Road Brewers Chevalier Saison** - Saison (6.5% ABV)
- **Bridge Road Brewers Beechworth Pale Ale** - American Pale Ale (5.2% ABV)
- **Bridge Road Brewers Robust Porter** - Porter (5.8% ABV)
- **Foghorn Breakwater Pale Ale** - American Pale Ale (5.0% ABV)
- **Foghorn Redhead Red Ale** - Red Ale (5.2% ABV)
- **Foghorn Black Sheep Stout** - Stout (5.5% ABV)
- **Hawkers Pale Ale** - American Pale Ale (5.0% ABV)
- **Hawkers IPA** - India Pale Ale (6.0% ABV)
- **Hawkers Lager** - Lager (4.5% ABV)
- **Akasha Brewing Hopsmith IPA** - India Pale Ale (6.2% ABV)
- **Akasha Brewing Freshwater Pale Ale** - American Pale Ale (4.8% ABV)
- **Akasha Brewing 5 O'Clock Shadow** - Stout (5.5% ABV)
- **Batch Brewing West Coast IPA** - India Pale Ale (6.5% ABV)
- **Batch Brewing Saison** - Saison (6.0% ABV)
- **Batch Brewing Pale Ale** - American Pale Ale (5.0% ABV)
- **Wayward Brewing Raspberry Berliner Weisse** - Berliner Weisse (3.2% ABV)
- **Wayward Brewing Charlie IPA** - India Pale Ale (6.0% ABV)
- **Wayward Brewing Sour Puss** - Sour Ale (4.0% ABV)
- **Nomad Brewing Long Trip Saison** - Saison (6.0% ABV)
- **Nomad Brewing Smooth Criminal** - Porter (5.5% ABV)
- **Nomad Brewing Freshie Salt & Pepper Gose** - Gose (4.0% ABV)
- **BentSpoke Crankshaft IPA** - India Pale Ale (6.0% ABV)
- **BentSpoke Barley Griffin** - Barley Wine (8.5% ABV)
- **BentSpoke Sprocket Red IPA** - Red IPA (6.0% ABV)
- **Capital Brewing Rock Hopper IPA** - India Pale Ale (6.0% ABV)
- **Capital Brewing Trail Pale Ale** - American Pale Ale (5.0% ABV)
- **Capital Brewing Cosmic Crush Sour** - Sour Ale (4.0% ABV)
- And many more...

### 🥃 Spirits
- **Whiskey** - Aged spirit (40-50% ABV)
- **Vodka** - Neutral spirit (40% ABV)
- **Gin** - Botanical spirit (40-47% ABV)
- **Rum** - Sugarcane spirit (40-50% ABV)
- **Tequila** - Agave spirit (40-50% ABV)

## Technical Details

### File Structure
```
beverage-input-app/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

### Technologies Used
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Font Awesome**: Icons for better UX
- **Google Fonts**: Inter font family for modern typography

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Features Implemented
- ✅ Tab switching between input methods
- ✅ Real-time search with debouncing
- ✅ Auto-complete suggestions
- ✅ Drag and drop file upload
- ✅ Image preview and validation
- ✅ Responsive design
- ✅ Loading animations
- ✅ Error handling
- ✅ Beautiful UI with modern design

## Future Enhancements

In a production environment, you could enhance this application with:

1. **Real AI Integration**: Connect to image recognition APIs (Google Vision, AWS Rekognition)
2. **Expanded Database**: Integrate with beverage APIs or databases
3. **User Accounts**: Save favorite beverages and search history

5. **Recipe Integration**: Add cocktail recipes and instructions
6. **Nutritional Information**: Include calorie and alcohol content
7. **Reviews and Ratings**: Community-driven beverage reviews

## Running the Application

### Local Development
Simply open `index.html` in any modern web browser. No server setup required!

```bash
# Navigate to the project directory
cd beverage-input-app

# Open in your default browser
open index.html  # macOS
# or
start index.html # Windows
# or
xdg-open index.html # Linux
```

### Local Development Server
For a better development experience with live reload:

```bash
# Install dependencies
npm install

# Start local server
npm start
```

Your site will be available at `http://localhost:3000`

## 🌐 Deploying to the Web

BevyFinder is ready to be deployed as a website! Choose from multiple free hosting options:

### Quick Deploy Options

1. **GitHub Pages (Recommended for beginners):**
   ```bash
   ./deploy.sh
   # Choose option 1
   ```

2. **Netlify (Drag & Drop):**
   - Go to [netlify.com](https://netlify.com)
   - Drag your project folder to deploy
   - Get a live URL instantly

3. **Vercel (Performance focused):**
   ```bash
   npm install -g vercel
   vercel
   ```

### Manual Deployment
For detailed deployment instructions, see [deploy.md](deploy.md)

### Features for Web Deployment
- ✅ SEO optimized with meta tags
- ✅ Open Graph and Twitter Card support
- ✅ Structured data for search engines
- ✅ Sitemap and robots.txt
- ✅ Responsive design for all devices
- ✅ Fast loading with preconnect hints
- ✅ GitHub Actions for automatic deployment

## Customization

### Adding New Beverages
To add new beverages to the database, edit the `beverageDatabase` object in `script.js`:

```javascript
const beverageDatabase = {
    'your-beverage': {
        name: 'Your Beverage Name',
        type: 'Category',
        alcohol: 'Alcohol Type',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        description: 'Description of the beverage',
        image: 'URL to image',
        tags: ['Tag1', 'Tag2']
    }
    // ... existing beverages
};
```

### Styling Changes
Modify `styles.css` to customize colors, fonts, and layout:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ffd700;
}
```

## License

This project is open source and available under the MIT License.

---

**Enjoy exploring beverages! 🍺🍷🍸** 
# urbansole - Modern React Shoe Store

A modern, responsive e-commerce website for selling shoes built with React, Vite, and Tailwind CSS.

## Features

- 🛍️ **Modern Product Catalog** - Browse shoes with high-quality images and detailed information
- 🔍 **Advanced Search & Filtering** - Search by name, brand, or category with multiple filter options
- 🛒 **Shopping Cart** - Add items to cart with size and color selection
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and smooth animations
- 💫 **Interactive Features** - Product quick view, wishlist, and cart management

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API with useReducer

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shoe-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header with search
│   ├── ProductCard.jsx # Product display card
│   ├── ProductModal.jsx # Product quick view modal
│   ├── CartSidebar.jsx # Shopping cart sidebar
│   └── Filters.jsx     # Product filtering sidebar
├── data/               # Static data
│   └── shoes.js        # Product catalog data
├── hooks/              # Custom React hooks
│   └── useCart.js      # Shopping cart state management
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Features Overview

### Product Catalog
- Display shoes with images, prices, ratings, and reviews
- Support for multiple colors and sizes
- Discount badges and sale prices
- Brand and category organization

### Search & Filtering
- Real-time search by product name, brand, or category
- Filter by category, brand, price range, and size
- Sort by featured, newest, price, or rating
- Clear all filters functionality

### Shopping Cart
- Add products with specific size and color selections
- Quantity management (increase/decrease)
- Remove items from cart
- Real-time total calculation
- Persistent cart state during session

### Responsive Design
- Mobile-first approach
- Collapsible navigation menu for mobile
- Responsive product grid layout
- Touch-friendly interface elements

## Customization

### Adding New Products
Edit `src/data/shoes.js` to add new products to the catalog. Each product should include:
- Unique ID
- Name, brand, and description
- Price and original price (for discounts)
- Image URL
- Available sizes and colors
- Category and features
- Rating and review count

### Styling
The project uses Tailwind CSS for styling. You can:
- Modify the color scheme in `tailwind.config.js`
- Add custom components in `src/index.css`
- Update the design system colors and fonts

### Adding New Features
The modular component structure makes it easy to add new features:
- Create new components in the `components/` directory
- Add new hooks in the `hooks/` directory
- Extend the cart functionality in `useCart.js`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

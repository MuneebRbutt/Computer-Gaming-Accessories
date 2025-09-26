# Advance IT Traders - React E-commerce Website

A modern, responsive e-commerce website built with Next.js 14, React 18, and Tailwind CSS for selling gaming PCs, laptops, and computer accessories.

## Features

### 🛍️ E-commerce Core
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries and specifications
- **Shopping Cart**: Add/remove items with persistent storage
- **Custom PC Builder**: Interactive component selection with compatibility checks
- **Responsive Design**: Mobile-first design that works on all devices

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek dark interface with electric blue accents
- **Smooth Animations**: Framer Motion for smooth transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and optimized images
- **Accessibility**: WCAG compliant with proper ARIA labels

### ⚡ Performance
- **Next.js 14**: App Router for optimal performance
- **Image Optimization**: Next.js Image component with lazy loading
- **State Management**: Zustand for efficient state management
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── products/[id]/     # Dynamic product pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Header.tsx        # Navigation header
│   ├── ProductCard.tsx   # Product card component
│   ├── ProductGrid.tsx   # Product grid with filtering
│   ├── ProductFilters.tsx # Filter controls
│   ├── PCBuilder.tsx     # Custom PC builder
│   └── ...
├── lib/                  # Utilities and data
│   ├── data.ts          # Product data and types
│   └── store.ts         # Zustand stores
└── public/              # Static assets
```

## Key Components

### Product Management
- **ProductCard**: Displays product information with add to cart functionality
- **ProductGrid**: Renders filtered and sorted product grid
- **ProductFilters**: Advanced filtering by category, brand, price, etc.

### PC Builder
- **Component Selection**: Choose from cases, CPUs, GPUs, RAM, storage, PSUs
- **Compatibility Checks**: Automatic power supply compatibility validation
- **Price Calculation**: Real-time price and wattage calculation

### State Management
- **Cart Store**: Manages shopping cart state with persistence
- **Filter Store**: Handles product filtering and search state

## Customization

### Adding New Products
Edit `lib/data.ts` to add new products to the `PRODUCTS` array:

```typescript
{
  id: 'unique-id',
  title: 'Product Name',
  price: 50000,
  category: 'Category',
  subcategory: 'Subcategory',
  brand: 'Brand',
  image: 'image-url',
  // ... other properties
}
```

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles use Tailwind classes

### Adding New Features
- Create new components in the `components/` directory
- Add new pages in the `app/` directory
- Extend stores in `lib/store.ts` for new state management needs

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
1. Build the project: `npm run build`
2. Start the production server: `npm start`
3. Deploy the `.next` folder to your hosting platform

## Performance Optimizations

- **Image Optimization**: All images use Next.js Image component
- **Code Splitting**: Automatic code splitting with Next.js
- **Lazy Loading**: Images and components load on demand
- **Caching**: Static generation for product pages
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

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

This project is licensed under the MIT License.

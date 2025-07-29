import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Tag } from 'lucide-react';

interface Product {
  product_id: number;
  name: string;
  name_marathi: string;
  price: number;
  discount_price: number | null;
  unit: string;
  primary_image: string;
  category_name: string;
  category_name_marathi: string;
  seller_name: string;
}

interface Category {
  category_id: number;
  name: string;
  name_marathi: string;
}

const KrushiBazaarHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      try {
        const mockCategories = [
          { category_id: 1, name: 'Seeds', name_marathi: 'बियाणे' },
          { category_id: 2, name: 'Fertilizers', name_marathi: 'खते' },
          { category_id: 3, name: 'Pesticides', name_marathi: 'कीटकनाशके' },
          { category_id: 4, name: 'Tools', name_marathi: 'औजारे' },
          { category_id: 5, name: 'Irrigation', name_marathi: 'सिंचन' }
        ];
        
        const mockProducts = [
          {
            product_id: 1,
            name: 'Organic Cotton Seeds',
            name_marathi: 'सेंद्रिय कापूस बियाणे',
            price: 450,
            discount_price: 399,
            unit: 'kg',
            primary_image: 'https://via.placeholder.com/300x200?text=Cotton+Seeds',
            category_name: 'Seeds',
            category_name_marathi: 'बियाणे',
            seller_name: 'Agro Seeds Ltd.'
          },
          {
            product_id: 2,
            name: 'NPK Fertilizer',
            name_marathi: 'एनपीके खत',
            price: 850,
            discount_price: null,
            unit: 'bag',
            primary_image: 'https://via.placeholder.com/300x200?text=NPK+Fertilizer',
            category_name: 'Fertilizers',
            category_name_marathi: 'खते',
            seller_name: 'Farm Supplies Co.'
          },
          {
            product_id: 3,
            name: 'Organic Pesticide',
            name_marathi: 'सेंद्रिय कीटकनाशक',
            price: 350,
            discount_price: 299,
            unit: 'liter',
            primary_image: 'https://via.placeholder.com/300x200?text=Organic+Pesticide',
            category_name: 'Pesticides',
            category_name_marathi: 'कीटकनाशके',
            seller_name: 'Green Earth Products'
          },
          {
            product_id: 4,
            name: 'Hand Cultivator',
            name_marathi: 'हाताने चालवण्याचे कृषी उपकरण',
            price: 550,
            discount_price: 499,
            unit: 'piece',
            primary_image: 'https://via.placeholder.com/300x200?text=Hand+Cultivator',
            category_name: 'Tools',
            category_name_marathi: 'औजारे',
            seller_name: 'Farm Tools Inc.'
          },
          {
            product_id: 5,
            name: 'Drip Irrigation Kit',
            name_marathi: 'ठिबक सिंचन संच',
            price: 2500,
            discount_price: 2299,
            unit: 'set',
            primary_image: 'https://via.placeholder.com/300x200?text=Drip+Irrigation',
            category_name: 'Irrigation',
            category_name_marathi: 'सिंचन',
            seller_name: 'Water Systems Ltd.'
          },
          {
            product_id: 6,
            name: 'Wheat Seeds',
            name_marathi: 'गहू बियाणे',
            price: 350,
            discount_price: 325,
            unit: 'kg',
            primary_image: 'https://via.placeholder.com/300x200?text=Wheat+Seeds',
            category_name: 'Seeds',
            category_name_marathi: 'बियाणे',
            seller_name: 'Agro Seeds Ltd.'
          }
        ];
        
        setCategories(mockCategories);
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call the API with search parameters
    console.log('Searching for:', searchQuery);
  };

  const handleAddToCart = (productId: number) => {
    // In a real app, this would call the API to add the product to the cart
    console.log('Adding product to cart:', productId);
    alert('Product added to cart!');
  };

  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategory && !categories.find(cat => cat.category_id === selectedCategory && cat.name === product.category_name)) {
      return false;
    }
    
    // Filter by price
    const price = product.discount_price || product.price;
    if (price < priceRange.min || price > priceRange.max) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.name_marathi.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query) ||
        product.category_name_marathi.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const translations = {
    en: {
      title: 'KrushiBazaar',
      subtitle: 'Digital marketplace for agricultural products',
      search: 'Search products...',
      searchButton: 'Search',
      filters: 'Filters',
      categories: 'Categories',
      allCategories: 'All Categories',
      priceRange: 'Price Range',
      min: 'Min',
      max: 'Max',
      applyFilters: 'Apply Filters',
      resetFilters: 'Reset',
      noProducts: 'No products found. Try changing your filters.',
      addToCart: 'Add to Cart',
      loading: 'Loading products...',
      error: 'Error loading products. Please try again.',
      perUnit: 'per',
      discount: 'Off',
      switchLanguage: 'मराठी',
      subsidyAvailable: 'Subsidy Available'
    },
    mr: {
      title: 'कृषीबाज़ार',
      subtitle: 'कृषी उत्पादनांसाठी डिजिटल बाजारपेठ',
      search: 'उत्पादने शोधा...',
      searchButton: 'शोधा',
      filters: 'फिल्टर्स',
      categories: 'श्रेणी',
      allCategories: 'सर्व श्रेणी',
      priceRange: 'किंमत श्रेणी',
      min: 'किमान',
      max: 'कमाल',
      applyFilters: 'फिल्टर लागू करा',
      resetFilters: 'रीसेट करा',
      noProducts: 'कोणतीही उत्पादने सापडली नाहीत. आपले फिल्टर बदलण्याचा प्रयत्न करा.',
      addToCart: 'कार्टमध्ये जोडा',
      loading: 'उत्पादने लोड होत आहेत...',
      error: 'उत्पादने लोड करताना त्रुटी. कृपया पुन्हा प्रयत्न करा.',
      perUnit: 'प्रति',
      discount: 'सूट',
      switchLanguage: 'English',
      subsidyAvailable: 'अनुदान उपलब्ध'
    }
  };

  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-800">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        <button 
          onClick={toggleLanguage}
          className="px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
        >
          {t.switchLanguage}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {t.searchButton}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-5 w-5" />
            {t.filters}
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">{t.categories}</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all-categories"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="all-categories" className="ml-2 text-gray-700">
                      {t.allCategories}
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.category_id} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.category_id}`}
                        name="category"
                        checked={selectedCategory === category.category_id}
                        onChange={() => setSelectedCategory(category.category_id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor={`category-${category.category_id}`} className="ml-2 text-gray-700">
                        {language === 'en' ? category.name : category.name_marathi}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t.priceRange}</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
                      {t.min}
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
                      {t.max}
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setPriceRange({ min: 0, max: 10000 });
                  setSearchQuery('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.resetFilters}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {t.applyFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.loading}</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {t.error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">{t.noProducts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.primary_image}
                  alt={language === 'en' ? product.name : product.name_marathi}
                  className="w-full h-48 object-cover"
                />
                {product.discount_price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((product.price - product.discount_price) / product.price) * 100)}% {t.discount}
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    {language === 'en' ? product.category_name : product.category_name_marathi}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {language === 'en' ? product.name : product.name_marathi}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{product.seller_name}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {product.discount_price ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-green-700">₹{product.discount_price}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-green-700">₹{product.price}</span>
                    )}
                    <span className="text-xs text-gray-500 block">
                      {t.perUnit} {product.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">{t.subsidyAvailable}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product.product_id)}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KrushiBazaarHome;
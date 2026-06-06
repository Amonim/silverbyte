import { products as localProducts, type Product } from '../data/product';

const API_URL = 'http://localhost:5000/api';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products from backend, using fallback:', error);
    return localProducts;
  }
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${id} from backend, using fallback:`, error);
    return localProducts.find((p) => p.id === id);
  }
};

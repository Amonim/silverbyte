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

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
};

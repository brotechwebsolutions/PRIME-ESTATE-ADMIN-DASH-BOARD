
export enum FlatStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold'
}

export interface Flat {
  _id?: string;
  id?: string; // Compatibility for different backend ID formats
  flatNo: string;
  type: string;
  price: number | string;
  status: FlatStatus;
  image: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface CreateOrderDto {
  name: string;
  price: number;
  quantity: number;
  status: string;
}

export interface GetOrderDto {
  id: number;
}

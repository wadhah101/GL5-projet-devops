export interface CreateOrderDto {
  name: string;
  price: number;
  quantity: number;
  status: string;
  payment: {
    cardNumber: string;
    cardHolder: string;
    expirationDate: string;
  };
}

export interface GetOrderDto {
  id: number;
}

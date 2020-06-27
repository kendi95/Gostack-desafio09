import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not already exists.', 400);
    }

    const findProducts = await this.productsRepository.findAllById(
      products.map(product => {
        return {
          id: product.id,
        };
      }),
    );

    if (findProducts.length === 0) {
      throw new AppError('Products does not exists.', 400);
    }

    const updatedQuantityOfProduct = await this.productsRepository.updateQuantity(
      products,
    );

    if (!updatedQuantityOfProduct) {
      throw new AppError('Products not found.', 400);
    }

    const order = await this.ordersRepository.create({
      customer,
      products: updatedQuantityOfProduct.map(product => {
        return {
          product_id: product.id,
          price: product.price,
          quantity: product.quantity,
        };
      }),
    });

    return order;
  }
}

export default CreateOrderService;

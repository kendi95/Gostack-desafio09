import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ name });
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const foundProducts = await this.ormRepository.find({
      where: { id: In(products.map(product => product.id)) },
    });

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const findProducts = await this.ormRepository.find({
      where: { id: In(products.map(product => product.id)) },
    });

    const updatedProducts = findProducts.map((product, index) => {
      if (product.quantity < products[index].quantity) {
        throw new AppError(
          'You can not create an order with insufficient quantities.',
          400,
        );
      }
      product.quantity -= products[index].quantity;
      return product;
    });

    const updated = await this.ormRepository.save(updatedProducts);

    const productsUpdated = updated.map((product, index) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: products[index].quantity,
        order_products: product.order_products,
        created_at: product.created_at,
        updated_at: product.updated_at,
      };
    });

    return productsUpdated;
  }
}

export default ProductsRepository;

import CreateProductService from '@modules/products/services/CreateProductService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const service = container.resolve(CreateProductService);
    const product = await service.execute({ name, price, quantity });
    return response.status(201).json(product);
  }
}

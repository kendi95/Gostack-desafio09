import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column('numeric')
  quantity: number;

  @OneToMany(() => OrdersProducts, ordersProducts => ordersProducts.product, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;

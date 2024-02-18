import { AllowNull, BeforeCreate, BeforeUpdate, Column, IsEmail, Model, Table, Unique, Default } from "sequelize-typescript";
import bcrypt from "bcryptjs";

@Table
class Alerte extends Model<Alerte> {

  @AllowNull(false)
  @Column
  service!: string;

  @AllowNull(false)
  @Column
  action!: string;

  @AllowNull(false)
  @Column
  user!: string;

  @AllowNull(false)
  @Column
  message!: string;

  @AllowNull(false)
  @Column
  level!: number;

}

export default Alerte;

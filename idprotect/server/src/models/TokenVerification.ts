import { AllowNull, BeforeCreate, BeforeUpdate, Column, IsEmail, Model, Table, Unique, Default } from "sequelize-typescript";
import bcrypt from "bcryptjs";

@Table
class TokenVerification extends Model<TokenVerification> {

  @AllowNull(false)
  @Column
  userId!: string

  @AllowNull(false)
  @Unique
  @Column
  token!: string

}

export default TokenVerification

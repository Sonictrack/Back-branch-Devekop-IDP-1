import { AllowNull, BeforeCreate, BeforeUpdate, Column, IsEmail, Model, Table, Unique, Default, Length, Min } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table
class Admin extends Model<Admin> {
  @AllowNull(false)
  @Column
  role!: string

  @AllowNull(false)
  @Unique
  @Column
  firstname!: string

  @AllowNull(false)
  @Unique
  @Column
  lastname!: string

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column
  email!: string

  @AllowNull(false)
  @Column
  password!: string

  @AllowNull(false)
  @Default(false)
  @Column
  suspended!: boolean;

  @AllowNull(false)
  @Column
  lastConnected!: Date

  @AllowNull(false)
  @Default(3)
  @Column
  numberAttempt!: number

  validPassword = (password: string): boolean =>
  bcrypt.compareSync(password, this.password)

  @BeforeUpdate
  @BeforeCreate
  static hashPassword = (user: Admin): void => {
    user.password = bcrypt.hashSync(user.password, 10)
  }
}

export default Admin

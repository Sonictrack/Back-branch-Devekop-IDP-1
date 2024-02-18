import { Column, Model, Table, AllowNull, HasMany, BeforeUpdate, BeforeCreate, IsEmail, Unique, Default, Length } from 'sequelize-typescript'
import bcrypt from 'bcryptjs'
import Folder from './Folder'
import Renouvellement from './Renouvellement'
import Notification from './Notification'

@Table
class Client extends Model<Client> {
  @AllowNull(false)
  @Column
  type!: string
  
  @AllowNull(false)
  @Column
  clientNumber!: string
  
  @AllowNull(false)
  @Column
  firstname!: string

  @AllowNull(false)
  @Column
  lastname!: string

  @AllowNull(true)
  @Column
  companyName!: string

  @AllowNull(true)
  @Column
  phoneNumber!: string

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column
  email!: string

  @AllowNull(false)
  @Column
  password!: string

  @AllowNull(false)
  @Default(false)
  @Column
  isPopular!: boolean

  @AllowNull(false)
  @Default(false)
  @Column
  isVerified!: boolean

  @AllowNull(false)
  @Default(false)
  @Column
  suspended!: boolean

  @AllowNull(true)
  @Column
  lastConnected!: Date

  @AllowNull(false)
  @Default(3)
  @Column
  numberAttempt!: number

  @AllowNull(false)
  @Default(50)
  @Column
  sizeSpace!: number

  @AllowNull(false)
  @Default(0)
  @Column
  credits!: number

  @HasMany(() => Folder)
  folders!: Folder[]

  @HasMany(() => Renouvellement)
  renouvellement!: Renouvellement[]

  @HasMany(() => Notification)
  notification!: Notification[]

  validPassword = (password: string): boolean => bcrypt.compareSync(password, this.password)

  @BeforeUpdate
  @BeforeCreate
  static hashPassword = (user: Client): void => {
    user.password = bcrypt.hashSync(user.password, 10)
  }
}
export default Client
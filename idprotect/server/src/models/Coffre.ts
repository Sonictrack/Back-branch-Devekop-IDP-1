import { Table, Column, Model, AllowNull, Unique } from 'sequelize-typescript'

@Table
class Coffre extends Model<Coffre> {
  
  @AllowNull(false)
  @Column
  type!: string

  @AllowNull(false)
  @Unique
  @Column
  number!: string

  @AllowNull(false)
  @Column
  email!: string
}

export default Coffre
import { Table, Column, Model, AllowNull } from 'sequelize-typescript'

@Table
class Position extends Model<Position> {
  @AllowNull(false)
  @Column
  latitude!: string
    
  @AllowNull(false)
  @Column
  longitude!: string

  @AllowNull(false)
  @Column
  from!: string

  @AllowNull(false)
  @Column
  to!: string

  @AllowNull(false)
  @Column
  action!: string

}

export default Position
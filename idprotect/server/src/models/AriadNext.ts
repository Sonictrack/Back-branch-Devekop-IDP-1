import {DataType, AllowNull, Column, Default, Model, Table} from 'sequelize-typescript';
import { DataTypes } from 'sequelize'

@Table
class AriadNext extends Model<AriadNext> {

  @AllowNull(false)
  @Column
  ownerId!: string;

  @AllowNull(false)
  @Column
  email!: string;

  @AllowNull(false)
  @Default(false)
  @Column
  credited!: boolean;

  @AllowNull(true)
  @Column
  uid!: string;

  @AllowNull(true)
  @Column
  idType!: string;

  @AllowNull(true)
  @Column
  documentNumber!: string;

  @AllowNull(true)
  @Column
  validity!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  summary!: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  controls!: string;  

  @AllowNull(true)
  @Column({
    type: DataType.TEXT
  })
  otherDetails!: string;

  @AllowNull(true)
  @Column({
    type: DataType.BLOB
  })
  ProtectIDPDFReport!: DataTypes.BlobDataType;  
}

export default AriadNext;

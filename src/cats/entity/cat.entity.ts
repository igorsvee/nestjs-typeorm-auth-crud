import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "cats" })
export class Cat {
  //  allow inserting the id value manually
  @PrimaryGeneratedColumn("identity", {
    name: "id",
    generatedIdentity: "BY DEFAULT",
  })
  id: number;

  @Column({ type: "varchar", length: 20 })
  name: string;

  @Column({ type: "int" })
  age: number;

  //todo use enum here instead?
  @Column({ type: "varchar", length: 30 })
  breed: string;
}

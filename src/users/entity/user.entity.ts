import * as crypto from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { Cat } from "../../cats/entity/cat.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @ManyToMany(() => Cat, { cascade: ["insert"] })
  @JoinTable({
    name: "cat_favourites",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "catId", referencedColumnName: "id" },
  })
  favouriteCats: Promise<Cat[]>; //  lazy relation

  @BeforeInsert()
  async hashPassword() {
    this.password = crypto.createHmac("sha256", this.password).digest("hex");
  }
}

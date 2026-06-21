import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn()
    id!: number;

    // Links this student record back to their login account in Auth Service.
    // Student Service does NOT store passwords or emails for login —
    // that data lives only in Auth Service. This is just a reference ID.
  @Column({ unique: true })
  userId!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  rollNumber!: string;

  @Column()
  className!: string; // e.g. "10th Grade"

  @Column()
  section!: string; // e.g. "A"

  @Column({ type: 'date' })
  dateOfBirth!: string;

  // Links to a parent's userId in Auth Service. Nullable because
  // not every student record may have a linked parent account yet.
  @Column({ nullable: true })
  parentUserId!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
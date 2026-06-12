import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Post } from '../../posts/entities/post.entity';
import { OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password!: string;
    
    @OneToMany(
        () => Post,
        (post) => post.author,  
    )
    posts!: Post[];

    @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
    })
    role: Role;
}

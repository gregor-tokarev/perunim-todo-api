import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { compare } from 'bcrypt';
import { authMethodType } from '../interfaces/auth-method.interface';

@Entity()
export class User extends BaseEntity {
  private defaultAvatarUrl = 'https://eu.ui-avatars.com/api';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  authMethod: authMethodType;

  @Column({ nullable: true })
  googleAccessToken?: string;

  @Column({ nullable: true })
  facebookAccessToken?: string;

  @Column()
  avatar: string;

  validatePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  setDefaultAvatar() {
    if (!this.email) {
      throw new Error('user object must have email for seting default avatar');
    }

    const query = new URLSearchParams();
    query.set('name', this.email);
    const imgUrl = this.defaultAvatarUrl + '?' + query.toString();
    this.avatar = imgUrl;
  }
}

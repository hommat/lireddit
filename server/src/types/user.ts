import { InputType, Field, ObjectType } from 'type-graphql';

import { User } from '../entities/User';
import { FieldError } from './shared';

@InputType()
export class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  email: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  password: string;

  @Field()
  token: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

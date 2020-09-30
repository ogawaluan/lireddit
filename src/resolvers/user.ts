import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Mycontext } from "src/types";
import argon from 'argon2'
import { User } from "../entities/User";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() {em}: Mycontext
    ) {
        const hashedPassword = await argon.hash(options.password) 
        const user = em.create(User, {username: options.username, password: hashedPassword})
        await em.persistAndFlush(user)
        return user;
    }
}
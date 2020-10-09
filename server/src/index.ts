import "reflect-metadata";
import microConfig from "./mikro-orm.config";
import express from "express";
import session from "express-session";
import cors from "cors";
import redis from "redis";
import connectRedis from "connect-redis";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(
    session({
        name: COOKIE_NAME,
        store: new RedisStore({ 
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: "lax", //csfr
            secure: __prod__ // cookie only works in https
        },
        saveUninitialized: false,
        secret: "ashioohasu",
        resave: false,
    })
    )
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }) 
    });

    apolloServer.applyMiddleware({ 
        app, 
        cors: false, 
    });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};



main().catch((err) => {
    console.log(err)
});
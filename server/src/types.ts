import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response, Express } from "express";

export type Mycontext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session: Express.Session };
    res: Response;
};
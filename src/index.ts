import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MyContext, GenderAPI, SpaceXAPI, NBAAPI } from "./graphql/context";
import schema from "./graphql/modules";
import nbaDataSource from "./graphql/DB/Config/dbconfig";

const context = {
  context: async () => {
    const { cache } = server;
    return {
      dataSources: {
        genderAPI: new GenderAPI({ cache }),
        spacexAPI: new SpaceXAPI(),
        nbaAPI: new NBAAPI(nbaDataSource),
      },
    };
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, context);
  return url;
};

// Set up our database, instantiate our connection before start the server
nbaDataSource
  .initialize()
  .then(async (dataSource) => {
    startServer().then((url) => console.log(`🚀  Server ready at: ${url}`));
  })
  .catch((error) => console.log(error));

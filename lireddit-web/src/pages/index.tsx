import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlCliente } from "../utils/createUrqlCliente";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  
  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlCliente, {ssr: true})(Index);

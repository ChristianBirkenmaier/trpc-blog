import Error from "next/error";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

function AllPosts() {
  const { data, error, isLoading } = trpc.useQuery(["posts.posts"]);

  if (isLoading) return <p>Loading ...</p>;

  if (error)
    return (
      <Error
        title={error.data?.code}
        statusCode={error.data?.httpStatus || 500}
      />
    );

  if (!data) return <p>No posts available</p>;

  return (
    <>
      {data?.map((post) => (
        <article key={post.id}>
          <div>
            <h3>{post.title}</h3>
            <p>{post.body}</p>

            <Link href={`/posts/${post.id}`}>Read more</Link>
          </div>
        </article>
      ))}
    </>
  );
}
export default AllPosts;

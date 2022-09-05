import Error from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

function SinglePostPage() {
  const router = useRouter();

  const postId = router.query.postId as string;

  //   if (!postId || typeof postId !== "string") {
  //     return <p>No post found matching the id</p>;
  //   }

  const { data, isLoading, error } = trpc.useQuery([
    "posts.single-post",
    { postId },
  ]);

  if (error) {
    return (
      <Error
        title={error.data?.code}
        statusCode={error.data?.httpStatus || 500}
      />
    );
  }
  if (isLoading) {
    return <p>Loading ...</p>;
  }
  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <h3>{data.title}</h3>
      <p>{data.body}</p>
      <p>{new Date(data.createdAt).toTimeString()}</p>
      <p>{new Date(data.updatedAt).toTimeString()}</p>
    </div>
  );
}

export default SinglePostPage;

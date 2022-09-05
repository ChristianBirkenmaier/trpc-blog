import router from "next/router";
import { useForm } from "react-hook-form";
import LoginForm from "../../components/LoginForm";
import { useUserContext } from "../../context/user.context";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

function CreatePostPage() {
  const user = useUserContext();
  const { handleSubmit, register } = useForm<CreatePostInput>();

  const { mutate, error } = trpc.useMutation(["posts.create-post"], {
    onSuccess({ id }) {
      router.push(`/posts/${id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1>Create posts</h1>

      <input type="text" placeholder="Your post title" {...register("title")} />
      <br />
      <textarea placeholder="Your post content" {...register("body")} />
      <br />

      <button>Create post</button>
    </form>
  );
}

export default CreatePostPage;

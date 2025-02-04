'use client'

// On click handlers and the like can only be put on client components,
// but they don't have access to the server-side node environment.
// As such, we have a server component [Page.tsx] import this client 
// component [PostButton.tsx], and pass in a server action. The [Action]
// suffix is important here, see:
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

interface Props {
  postAction: (formData: FormData) => void;
};

export default function PostButton({ postAction }: Props) {
  return (
    <form action={postAction}>
      <button className="border-8" type="submit">
        Press me!
      </button>
    </form>
  );
}
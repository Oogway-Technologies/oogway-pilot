import Image from "next/image";
import { ChatAltIcon, ShareIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

function PostAPI({ id, name, message, email, postImage, image, timestamp }) {
  // Use the router to redirect the user to the comments page
  const router = useRouter();

  const avatarURL =
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

  const enterComments = () => {
    router.push(`/comments/${id}`);
  };

  return (
    <div className="flex flex-col">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-md shadow-indigo-500/50">
        <div className="flex items-center space-x-2">
          <img
            className="rounded-full"
            src={image ? image : avatarURL}
            width={40}
            height={40}
            alt=""
          />
          <div>
            <p className="font-medium text-black">{name}</p>
            {timestamp ? (
              <p className="text-xs text-gray-400">
                {new Date(timestamp?.toDate()).toLocaleString()}
              </p>
            ) : (
              // Do this for prefetching from server-side
              <p className="text-xs text-gray-400">Loading</p>
            )}
          </div>
        </div>
        <p className="pt-4 text-black">{message}</p>
      </div>
      {/* Only if there is a post image show the image */}
      {postImage && (
        <div className="relative h-56 md:h-96 bg-white">
          {/* Fill the image RELATIVE to the parent.
            Note: the parent MUST be relative!
            Note: using contain works but the image doesn't cover the whole space
            Note: using cover doesn't work well unless we resize the image
          */}
          <Image src={postImage} objectFit="cover" layout="fill" />
        </div>
      )}

      {/* Footer of the post */}
      <div className="flex justify-between items-center rounded-b-2xl bg-white shadow-md text-gray-400 border-t">
        <div className="inputIcon rounded-none rounded-bl-2xl">
          <ThumbUpIcon className="h-4" />
          <p className="text-xs sm:text-base">Like</p>
        </div>

        <div className="inputIcon" onClick={enterComments}>
          <ChatAltIcon className="h-4" />
          <p className="text-xs sm:text-base">Comment</p>
        </div>

        <div className="inputIcon rounded-none rounded-br-2xl">
          <ShareIcon className="h-4" />
          <p className="text-xs sm:text-base">Share</p>
        </div>
      </div>
    </div>
  );
}

export default PostAPI;

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "../_lib/actions";

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="py-3 px-5 hover:bg-primary-200 hover:text-primary-900 transition-colors flex items-center gap-4 font-semibold text-primary-700 w-full">
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-accent-500" />
        <span>退出登录</span>
      </button>
    </form>
  );
}

export default SignOutButton;

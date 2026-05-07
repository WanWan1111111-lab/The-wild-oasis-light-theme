import { signInAction } from "../_lib/actions";
import Image from "next/image";

function SignInButton() {
  return (
    <div className="flex flex-col gap-4">
     

      <div className="text-center text-sm text-primary-500">或使用第三方账号登录</div>

      <form action={signInAction}>
        <input type="hidden" name="provider" value="google" />
        <button 
          type="submit"
          className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium w-full"
        >
          <Image
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            height={24}
            width={24}
          />
          <span>使用 Google 账号登录</span>
        </button>
      </form>

      <form action={signInAction}>
        <input type="hidden" name="provider" value="github" />
        <button 
          type="submit"
          className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium w-full"
        >
          <Image
            src="https://authjs.dev/img/providers/github.svg"
            alt="GitHub logo"
            height={24}
            width={24}
          />
          <span>使用 GitHub 账号登录</span>
        </button>
      </form>
    </div>
  );
}

export default SignInButton;

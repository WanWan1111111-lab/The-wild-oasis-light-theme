import SignInButton from "../_components/SignInButton";

export const metadata = {
  title: "登录",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        登录您的专属会员空间
      </h2>

      <SignInButton />
    </div>
  );
}

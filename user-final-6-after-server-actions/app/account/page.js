import { auth } from "../_lib/auth";

export const metadata = {
  title: "会员中心",
};

export default async function Page() {
  const session = await auth();

  const firstName = session.user.name.split(" ").at(0);

  return (
    <h2 className="font-semibold text-2xl text-accent-600 mb-7">
      欢迎回来，{firstName}
    </h2>
  );
}

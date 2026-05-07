import Link from "next/link";

function LoginMessage() {
  return (
    <div className="grid bg-primary-50 border border-primary-300">
      <p className="text-center text-xl py-12 self-center text-primary-700">
        请先{" "}
        <Link href="/login" className="underline text-accent-600">
          登录
        </Link>{" "}
        即可预订
        <br /> 这间奢华木屋
      </p>
    </div>
  );
}

export default LoginMessage;

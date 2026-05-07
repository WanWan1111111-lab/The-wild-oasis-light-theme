import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { signup, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    signup(
      { fullName, email, password },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="姓名" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "请输入姓名" })}
        />
      </FormRow>

      <FormRow label="邮箱" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "请输入邮箱",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "请输入有效的邮箱地址",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="密码（至少8位）"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "请输入密码",
            minLength: {
              value: 8,
              message: "密码长度至少为8位",
            },
          })}
        />
      </FormRow>

      <FormRow label="确认密码" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "请再次输入密码",
            validate: (value) =>
              value === getValues().password || "两次密码输入不一致",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={reset}
        >
          取消
        </Button>
        <Button disabled={isLoading}>创建账号</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;

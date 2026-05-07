import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="木屋名称" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "请输入木屋名称",
          })}
        />
      </FormRow>

      <FormRow label="最大入住人数" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "请输入最大入住人数",
            min: {
              value: 1,
              message: "至少可住1人",
            },
          })}
        />
      </FormRow>

      <FormRow label="标准价格" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "请输入标准价格",
            min: {
              value: 1,
              message: "价格至少为1",
            },
          })}
        />
      </FormRow>

      <FormRow label="优惠金额" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "请输入优惠金额",
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              "优惠金额不能超过标准价格",
          })}
        />
      </FormRow>

      <FormRow
        label="木屋描述"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", {
            required: "请输入木屋描述",
          })}
        />
      </FormRow>

      <FormRow label="木屋图片">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "请上传木屋图片",
          })}
        />
      </FormRow>

      <FormRow label="纬度" error={errors?.latitude?.message}>
        <Input
          type="number"
          id="latitude"
          step="any"
          disabled={isWorking}
          placeholder="例：46.4102"
          {...register("latitude", {
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow label="经度" error={errors?.longitude?.message}>
        <Input
          type="number"
          id="longitude"
          step="any"
          disabled={isWorking}
          placeholder="例：11.8440"
          {...register("longitude", {
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          取消
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "保存" : "创建"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

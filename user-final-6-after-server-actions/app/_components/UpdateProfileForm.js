"use client";

import { useState } from "react";
import Image from "next/image";
import { updateGuest } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ guest, children }) {
  const [count, setCount] = useState();

  const { fullName, email, nationality, nationalID, countryFlag } = guest;

  return (
    <form
      action={updateGuest}
      className="bg-primary-50 py-8 px-12 text-lg flex gap-6 flex-col border border-primary-300"
    >
      <div className="space-y-2">
        <label className="text-primary-700">姓名</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-600 w-full shadow-sm rounded-sm disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-primary-700">邮箱地址</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-600 w-full shadow-sm rounded-sm disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality" className="text-primary-700">国籍</label>
          {countryFlag && (
            <Image
              src={countryFlag}
              alt="国旗"
              width={20}
              height={15}
              className="rounded-sm"
            />
          )}
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID" className="text-primary-700">身份证号码</label>
        <input
          defaultValue={nationalID}
          name="nationalID"
          className="px-5 py-3 bg-white border border-primary-300 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none focus:border-accent-500"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="更新中...">更新资料</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;

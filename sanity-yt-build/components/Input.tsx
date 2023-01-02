import React from "react";
import { iInput } from "../typings";

function Input({ children, placeholder, type, register }: iInput) {
  return (
    <label className="block mb-5">
      <span className="text-gray-700">{children}</span>
      <input
        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
        placeholder={placeholder}
        type={type}
        {...register}
      />
    </label>
  );
}

export default Input;

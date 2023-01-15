import { useReducer, useEffect } from "react";
import { useForm } from "react-hook-form";

const Input = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder || ""}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...register(props.id, props.validators)}
      />
    ) : (
      <textarea id={props.id} name={props.id} rows={props.rows || 3} />
    );

  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700"
        htmlFor={props.id}
      >
        {props.label}
      </label>
      {element}
      {/* {!inputState.isValid && inputState.isTouched && ( */}
      {/*   <p className="text-sm text-red-700">{props.errorText}</p> */}
      {/* )} */}
    </div>
  );
};

export default Input;

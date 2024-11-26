import { RootState } from "../store";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import createDynamicSchema from "../model/createDynamicSchema";
import { initializeForm, updateForm } from "../store/formSlice";

type FormData = Record<string, unknown>;

const DynamicForm = ({ formJson }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form);

  console.log(formData);

  useEffect(() => {
    dispatch(initializeForm(formJson));
  }, [dispatch, formJson]);

  const schema = createDynamicSchema(formJson.fields);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: formData,
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Submitted:", data);
    fetch(formJson.submitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  };

  const handleChange = (field, value) => {
    dispatch(updateForm({ field, value }));
  };

  const renderField = (field) => {
    const { label, name, type, placeholder } = field;

    switch (type) {
      case "text":
      case "email":
      case "number":
        return (
          <>
            <div key={name} className="mb-4">
              <label className="block mb-1 font-bold">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(name)}
                value={formData[name] || ""}
                onChange={(e) => handleChange(name, e.target.value)}
                className={`border p-2 rounded w-full ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm">{`${errors[name].message}`}</p>
              )}
            </div>
          </>
        );

      case "checkbox":
        return (
          <div className="mb-4 flex items-center">
            <input
              key={name}
              name={name}
              type="checkbox"
              {...register(name)}
              checked={formData[name] || false}
              onChange={(e) => handleChange(name, e.target.checked)}
              className="mr-2"
              id={name}
            />
            <label htmlFor={name}>{label}</label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 mt-32 max-w-2xl mx-4 sm:mx-auto border border-gray-300 rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4">{formJson.title}</h2>
      <p className="text-gray-600 mb-4">{formJson.description}</p>

      {formJson.fields.map((field) => renderField(field))}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isSubmitting}
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;

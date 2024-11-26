import DynamicForm from "./components/DynamicForm";

const formJson = {
  title: "Advanced Dynamic Form",
  description: "Fill out the required fields to proceed.",
  fields: [
    {
      label: "Name",
      name: "name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      required: true,
      validation: {
        regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
        errorMessage: "Please enter a valid email address.",
      },
    },
    {
      label: "Age",
      name: "age",
      type: "number",
      placeholder: "Enter your age",
      required: true,
      validation: {
        min: 18,
        max: 100,
        errorMessage: "Age must be between 18 and 100.",
      },
    },
    {
      label: "Newsletter Subscription",
      name: "newsletter",
      type: "checkbox",
      default: false,
    },
  ],
  submitUrl: "https://api.example.com/submit-form",
};

const App = () => {
  return <DynamicForm formJson={formJson} />;
};

export default App;

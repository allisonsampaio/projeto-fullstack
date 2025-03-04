import { Meta, StoryObj } from "@storybook/react";
import Form from "./Form";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    fields: [
      {
        name: "name",
        label: "Nome da Categoria",
        type: "text",
        required: true,
      },
    ],
    onSubmit: () => alert("Formulário enviado!"),
    error: null,
    success: null,
    onCloseSnackbar: () => {},
    initialValues: { name: "" },
    onInputChange: (e) => console.log(e.target.value),
  },
};
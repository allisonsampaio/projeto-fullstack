import { Meta, StoryObj } from "@storybook/react";
import DataTable from "./DataTable";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    headers: ["ID", "Nome"],
    rows: [
      { ID: 1, Nome: "Categoria 1" },
      { ID: 2, Nome: "Categoria 2" },
    ],
  },
};
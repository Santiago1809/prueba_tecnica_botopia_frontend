import ProductTable from "@/components/custom/admin/TableProducts";

export default function ProductsPage() {

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <p className="text-muted-foreground">
          Administra tu inventario de manera eficiente
        </p>
      </div>
      <ProductTable />
    </div>
  );
}

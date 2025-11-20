import Layout from "@/components/Layout";

interface PlaceholderPageProps {
  title: string;
  role: "ADVISOR" | "STUDENT";
}

const PlaceholderPage = ({ title, role }: PlaceholderPageProps) => {
  return (
    <Layout title={title} role={role}>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">This page is under construction.</p>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceholderPage;

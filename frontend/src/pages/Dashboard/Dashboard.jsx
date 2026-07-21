import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import PageContainer from "../../components/layout/PageContainer/PageContainer";

import DashboardContent from "../../components/dashboard/DashboardContent/DashboardContent";

export default function Dashboard() {
  return (
    <>
      <PageContainer>

        <Navbar />

        <DashboardContent />

        <Footer />

      </PageContainer>
    </>
  );
}
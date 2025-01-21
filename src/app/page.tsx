import Banner from "@/components/custom/Banner";
import Container from "@/components/custom/Container";
import FeaturedProducts from "@/components/custom/FeaturedProducts";
import RecommendedProducts from "@/components/custom/RecommendedProducts";

export default function Home() {
  return (
    <Container>
      <Banner />
      <FeaturedProducts />
      <RecommendedProducts />
    </Container>
  );
}

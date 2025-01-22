import Banner from "@/components/custom/Banner";
import Container from "@/components/custom/Container";
import FeaturedProducts from "@/components/custom/FeaturedProducts";

export default function Home() {
  return (
    <Container>
      <Banner />
      <FeaturedProducts />
    </Container>
  );
}

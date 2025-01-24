import Banner from "@/components/custom/Banner";
import Container from "@/components/custom/Container";
import FeaturedProducts from "@/components/custom/FeaturedProducts";
import { PopupCarousel } from "@/components/custom/Popups";

export default function Home() {
  return (
    <Container>
      <Banner />
      <PopupCarousel />
      <FeaturedProducts />
    </Container>
  );
}

import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { useEffect } from "react";
import styled from "styled-components";

export default function Usage() {
  const { theme } = useTheme();
  const { setPageLoading, storeInfo } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [setPageLoading]);
  return (
    <Container>
      <Section>
        <Title style={{ color: theme.primary }}>
          Welcome to {storeInfo.name}, the Ultimate Destination for Sports
          Enthusiasts!
        </Title>
        <Paragraph style={{ color: theme.secondaryText }}>
          Founded in 2024, {storeInfo.name} has grown from a passionate vision
          into a thriving online retailer, dedicated to bringing the best in
          sports equipment, apparel, and accessories to athletes and fitness
          enthusiasts around the globe.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Our Mission</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          At {storeInfo.name}, our mission is to inspire and equip you to
          achieve your fitness goals and enjoy the journey along the way.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Why Choose Us?</Subtitle>
        <List style={{ color: theme.secondaryText }}>
          <ListItem>
            Curated Selection: We handpick our inventory from the world&apos;s
            leading sports brands.
          </ListItem>
          <ListItem>
            Expertise You Can Trust: Our team consists of seasoned athletes and
            sports enthusiasts.
          </ListItem>
          <ListItem>
            Commitment to Quality: Every item is tested for quality and
            performance.
          </ListItem>
          <ListItem>
            Community and Support: Join a community of like-minded individuals.
          </ListItem>
        </List>
      </Section>

      <Section>
        <Subtitle>Our Products</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          From cutting-edge fitness technology to timeless athletic gear, our
          extensive range includes apparel, equipment, and accessories that
          reflect excellence and innovation.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Sustainability</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          As lovers of outdoor sports and the natural world, we&apos;re
          committed to sustainability. {storeInfo.name} actively seeks
          eco-friendly products and practices.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Get In Touch</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We&apos;re here to help you find the right products, offer expert
          advice, and answer any questions you may have. Contact us at{" "}
          {storeInfo.email}, {storeInfo.phone[0]}, or follow us on social media.
        </Paragraph>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 24px auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  color: orange;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
`;

const List = styled.ul`
  list-style: inside square;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  line-height: 1.6;
`;

import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { useEffect } from "react";
import styled from "styled-components";

export default function Terms() {
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
          Terms and Conditions for {storeInfo.name} eStore
        </Title>
        <Paragraph style={{ color: theme.secondaryText }}>
          Welcome to {storeInfo.name}! Our eStore provides a wide selection of
          sports goods and apparel to support your fitness and sporting journey.
          By using our website, mobile app, or purchasing products from us, you
          agree to these terms and conditions ("Terms").
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Eligibility</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          You must be at least 18 years old or have parental consent to make
          purchases.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Account Registration:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          To access certain features or make a purchase, you may need to create
          an account, providing accurate and complete information.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Privacy</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          Your privacy is important to us. Our Privacy Policy explains how we
          collect, use, and protect your personal information.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Accuracy</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We strive to ensure that all product descriptions, prices, and
          availability are accurate, but errors may occur. We reserve the right
          to correct any errors and to change or update information at any time.
        </Paragraph>
      </Section>

      <Section>
        <Subtitle>Colors and Specifications:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          Product images are displayed as accurately as possible. However, the
          actual colors you see depend on your device, and we cannot guarantee
          accuracy.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Acceptance of Orders:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          All orders are subject to acceptance by us, and we will confirm such
          acceptance by sending you an email confirming the shipment of your
          order.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Payment:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We accept various forms of payment as indicated during checkout. By
          submitting an order, you authorize {storeInfo.name}, or its payment
          processor, to charge the provided payment method.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Taxes:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          You are responsible for any taxes applicable to your purchase.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Shipping Policies:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          Shipping times and costs will vary depending on your location and the
          shipping options you select.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Returns and Exchanges:</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          If you are not satisfied with your purchase, you may return it within
          [number] days of receipt for a refund or exchange, subject to our
          Returns Policy.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Intellectual Property</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          All content included on the site, such as text, graphics, logos, and
          images, is the property of {storeInfo.name} or its content suppliers
          and protected by intellectual property laws.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Limitation of Liability</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          {storeInfo.name} will not be liable for any direct, indirect,
          incidental, punitive, or consequential damages that result from the
          use of, or the inability to use, the website or the products sold on
          it.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Changes to Terms and Conditions</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We reserve the right to update or modify these Terms at any time
          without prior notice. Your continued use of {storeInfo.name}'s eStore
          following any such changes constitutes your agreement to the new
          Terms.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Governing Law</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          These Terms are governed by the laws of Georgia, without regard to its
          conflict of law principles.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Contact Us</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          For any questions or concerns regarding these Terms, please contact us
          at {storeInfo.email}, {storeInfo.phone[0]}.
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

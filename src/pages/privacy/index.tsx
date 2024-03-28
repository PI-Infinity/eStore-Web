import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { useEffect } from "react";
import styled from "styled-components";

export default function Privacy() {
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
          Privacy Policy for {storeInfo.name},
        </Title>
        <Paragraph style={{ color: theme.secondaryText }}>
          Last Updated: 2024 year.
        </Paragraph>
        <Paragraph style={{ color: theme.secondaryText }}>
          At {storeInfo.name}, accessible from [Your Website URL], one of our
          main priorities is the privacy of our visitors. This Privacy Policy
          document outlines the types of information collected and recorded by
          {storeInfo.name} and how we use it.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Information We Collect</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We collect information to provide better services to all our users. We
          collect information in the following ways:
          <List>
            <Paragraph style={{ color: theme.primaryText }}>
              Information you give us:
            </Paragraph>
            <ListItem>
              For example, our services require you to sign up for an account,
              where we may ask for personal information like your name, email
              address, telephone number, or credit card.
            </ListItem>
          </List>
          <List>
            <Paragraph style={{ color: theme.primaryText }}>
              Information we get from your use of our services: This could
              include:
            </Paragraph>
            <ListItem>
              Log Data: We automatically collect certain information when you
              visit our website, such as your IP address, browser type, and
              access times.
            </ListItem>
            <ListItem>
              Cookies: We use cookies to improve your experience on our website,
              understand user activity, and improve the quality of our services.{" "}
            </ListItem>
          </List>
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Use of Information</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          The information we collect from all our services is used to provide,
          maintain, protect, and improve them, to develop new ones, and to
          protect {storeInfo.name} and our users. We also use this information
          to offer you tailored content – like giving you more relevant search
          results and ads.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Information Sharing</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          {storeInfo.name} does not share personal information with companies,
          organizations, and individuals outside of [Your Sports Shop Name]
          except in the following cases:
          <List>
            <Paragraph style={{ color: theme.primaryText }}>
              With your consent:
            </Paragraph>
            <ListItem>
              We will share personal information with companies, organizations,
              or individuals outside of {storeInfo.name} when we have your
              consent to do so.
            </ListItem>
          </List>
          <List>
            <Paragraph style={{ color: theme.primaryText }}>
              For legal reasons:
            </Paragraph>
            <ListItem>
              We will share personal information with companies, organizations,
              or individuals outside of {storeInfo.name} if we have a good-faith
              belief that access, use, preservation, or disclosure of the
              information is reasonably necessary to meet any applicable law,
              regulation, legal process, or enforceable governmental request.
            </ListItem>
          </List>
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Security</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We strive to use commercially acceptable means to protect your
          personal information, but remember that no method of transmission over
          the internet or method of electronic storage is 100% secure.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Your Data Protection Rights</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          Depending on your location, you may have rights under data protection
          laws, including:
          <List>
            <ListItem>
              The right to access, update, or to delete the information we have
              on you.
            </ListItem>
            <ListItem>The right of rectification.</ListItem>
            <ListItem>The right to object.</ListItem>
            <ListItem>The right of restriction.</ListItem>
            <ListItem>The right to data portability</ListItem>
            <ListItem>The right to withdraw consent.</ListItem>
          </List>
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Third-Party Privacy Policies</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          {storeInfo.name}'s Privacy Policy does not apply to other advertisers
          or websites. Thus, we advise you to consult the respective Privacy
          Policies of these third-party ad servers for more detailed
          information.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Children's Information</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          {storeInfo.name} does not knowingly collect any personally
          identifiable information from children under the age of 13. If you
          believe that your child provided this kind of information on our
          website, we strongly encourage you to contact us immediately, and we
          will do our best efforts to promptly remove such information from our
          records.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Consent</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Changes to Our Privacy Policy</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. We will
          let you know via email and/or a prominent notice on our Service, prior
          to the change becoming effective and update the "Last updated" date at
          the top of this Privacy Policy. You are advised to review this Privacy
          Policy periodically for any changes. Changes to this Privacy Policy
          are effective when they are posted on this page.
        </Paragraph>
      </Section>
      <Section>
        <Subtitle>Contact Us</Subtitle>
        <Paragraph style={{ color: theme.secondaryText }}>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us at: {storeInfo.email}, {storeInfo.phone[0]}
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

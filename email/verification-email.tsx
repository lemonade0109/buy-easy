import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationUrl: string;
  userName?: string;
}

export default function VerificationEmail({
  verificationUrl,
  userName,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to complete registration</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Heading style={logoText}>BuyEasy</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Verify Your Email Address</Heading>

            <Text style={paragraph}>
              {userName ? `Hi ${userName},` : "Hello,"}
            </Text>

            <Text style={paragraph}>
              Thanks for signing up with BuyEasy! To complete your registration
              and start shopping, please verify your email address by clicking
              the button below:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={paragraph}>
              Or copy and paste this URL into your browser:
            </Text>

            <Text style={link}>
              <Link href={verificationUrl} style={anchor}>
                {verificationUrl}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              This link will expire in 24 hours. If you didn&apos;t create an
              account with BuyEasy, you can safely ignore this email.
            </Text>

            <Text style={footer}>
              Need help? Contact us at{" "}
              <Link href="mailto:support@buyeasy.com" style={anchor}>
                support@buyeasy.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} BuyEasy. All rights reserved.
            </Text>
            <Text style={footerText}>Your one-stop shop for everything!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const logoSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
  backgroundColor: "#ffffff",
};

const logoText = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
  letterSpacing: "-0.5px",
};

const content = {
  padding: "0 40px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "30px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#525252",
  marginBottom: "16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
  cursor: "pointer",
};

const link = {
  fontSize: "14px",
  color: "#525252",
  wordBreak: "break-all" as const,
  marginTop: "16px",
  marginBottom: "32px",
};

const anchor = {
  color: "#2563eb",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#71717a",
  marginBottom: "12px",
};

const footerSection = {
  padding: "32px 40px 0",
  borderTop: "1px solid #e5e7eb",
  marginTop: "32px",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#9ca3af",
  textAlign: "center" as const,
  marginBottom: "8px",
};

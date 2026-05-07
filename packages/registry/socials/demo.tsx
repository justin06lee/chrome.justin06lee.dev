import SocialBar from "./socials";

export default function SocialsDemo() {
  return (
    <SocialBar
      links={{
        github: "https://github.com/justin06lee",
        x: "https://x.com/example",
        email: "hi@example.com",
      }}
      size="md"
    />
  );
}

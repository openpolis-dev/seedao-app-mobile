import GuildProvider from "./provider";
import GuildInfo from "./info";

export default function GuildInfoRoot() {
  return (
    <GuildProvider>
      <GuildInfo />
    </GuildProvider>
  );
}

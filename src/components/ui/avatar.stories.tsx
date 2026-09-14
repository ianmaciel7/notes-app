import type { Story, StoryDefault } from "@ladle/react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "./avatar";

export default { title: "Componentes / UI / Avatar" } satisfies StoryDefault;

export const Default: Story = () => <Avatar><AvatarFallback>IM</AvatarFallback></Avatar>;

export const Group: Story = () => (
  <AvatarGroup>
    <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
    <AvatarGroupCount>+4</AvatarGroupCount>
  </AvatarGroup>
);
